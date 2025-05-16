import Joi from "joi";

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  email: Joi.string().email().max(150),
  specialty: Joi.string().max(100),
  bio: Joi.string().max(1000),
})
  .min(1)
  .message("At least one field must be provided");

export async function userUpdateValidator(req, res, next) {
    const { error } = userUpdateSchema.validate(req.body)
    if (error){
        return res.status(400).json({ message: error.details[0].message });
    }
    next()
}