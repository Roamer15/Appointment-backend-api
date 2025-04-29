import Joi from "joi";

const clientRegisterValidator = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 2 }).required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirmPassword: Joi.ref('password'),
  profileImageUrl: Joi.string().uri().pattern(/\.(jpeg|jpg|gif|png)$/i).allow("").optional()
})

export const registrationValidator = (req, res, next) => {
  const { error } = clientRegisterValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const providerRegisterValidator = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 2 }).required(),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  confirmPassword: Joi.ref('password'),
  specialty: Joi.string().min(3).required(),
  bio: Joi.string().optional()
})


export const providerRegistrationValidator = (req, res, next) => {
  const { error } = providerRegisterValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};


const loginSchema = Joi.object({
  email: Joi.string().email({ maxDomainSegments: 2 }).required(),
  password: Joi.string().required(),
})

export const loginValidator = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
