import { query } from "../config/db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from "../utils/logger.js"

export async function loginHandler(req, res,next){
    const {email, password} = req.body
    try {
        const findClientQuery =     'SELECT id, email, first_name, last_name, password FROM clients WHERE email = $1'
        const clientResult = await query(findClientQuery, [email])

        if (clientResult.rows.length === 0) {
            logger.warn(`Login Attempt failed: Account with email ${email} doesn't exist`);
            return res.status(401).json({ message: "Account not found, invalid credentials" });
          }
          

        const client = clientResult.rows[0]

        const is_passwordMatch = await bcrypt.compare(password, client.password)

        if(!is_passwordMatch) {
            logger.warn(`Login attempt failed: Incorrect password - ${email}`)
            return res.status(401).json({ message: "Invalid password" })
        }

        const payload = {
            user: {
              id: client.id,
              email: client.email
            }
          }

          jwt.sign(payload, process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN
            }, (err, token) => {
              if (err) {
                logger.error(`Error generating JWT for ${email}: `, err)
                throw new Error('Error generating authentication token')
              }
              logger.info(`User logged in successfully: ${email} (ID: ${client.id})`)
              res.json({
                message: "Login Successfull!",
                token: token,
                user: {
                  id: client.id,
                  firstName: client.first_name,
                  lastName: client.last_name,
                  email: client.email
                }
              })
            })
    } catch(err) {
        logger.error(`Error during login process for ${email}: `, err)
    res.status(500).json({ message: err.message || "Server error during login" })
    }
}

export async function providerLoginHandler(req, res,next){
  const {email, password} = req.body
  try {
      const findProviderQuery =     'SELECT id, email, first_name, last_name, password FROM providers WHERE email = $1'
      const providerResult = await query(findProviderQuery, [email])

      if (providerResult.rows.length === 0) {
          logger.warn(`Login Attempt failed: Account with email ${email} doesn't exist`);
          return res.status(401).json({ message: "Account not found, invalid credentials" });
        }
        

      const provider = providerResult.rows[0]

      const is_passwordMatch = await bcrypt.compare(password, provider.password)

      if(!is_passwordMatch) {
          logger.warn(`Login attempt failed: Incorrect password - ${email}`)
          return res.status(401).json({ message: "Invalid password" })
      }

      const payload = {
          user: {
            id: provider.id,
            email: provider.email
          }
        }

        jwt.sign(payload, process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN
          }, (err, token) => {
            if (err) {
              logger.error(`Error generating JWT for ${email}: `, err)
              throw new Error('Error generating authentication token')
            }
            logger.info(`Provider logged in successfully: ${email} (ID: ${provider.id})`)
            res.json({
              message: "Login Successfull!",
              token: token,
              user: {
                id: provider.id,
                firstName: provider.first_name,
                lastName: provider.last_name,
                email: provider.email,
              }
            })
          })
  } catch(err) {
      logger.error(`Error during login process for ${email}: `, err)
  res.status(500).json({ message: err.message || "Server error during login" })
  }
}