import Joi from "joi";

const registerValidator = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters'
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters'
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required'
  }),

  password: Joi.string()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:"\\\\|,.<>\\/?]).{8,}$'
      )
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long, include upper and lower case letters, a number, and a special character',
      'string.empty': 'Password is required',
    }),

  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required',
    }),

  profileImageUrl: Joi.string()
    .uri()
    .pattern(/\.(jpeg|jpg|gif|png)$/i)
    .optional()
    .allow(""),

  role: Joi.string()
    .valid('client', 'provider')
    .required()
    .messages({
      'any.only': 'Role must be either "client" or "provider"',
      'string.empty': 'Role is required',
    }),

  // These fields only make sense for providers
  specialty: Joi.string()
    .max(100)
    .when('role', { is: 'provider', then: Joi.required() }),

  bio: Joi.string()
    .max(500)
    .when('role', { is: 'provider', then: Joi.optional() }),
});


export const registrationValidator = (req, res, next) => {
  const { error } = registerValidator.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const loginValidator = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
