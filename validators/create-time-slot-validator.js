import Joi from "joi";

// Regex for HH:mm:ss format (24-hour)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const createSlotSchema = Joi.object({
  day: Joi.date().iso().required().messages({
    'date.base': `"day" must be a valid ISO date`,
    'any.required': `"day" is required`
  }),
  startTime: Joi.string().pattern(timeRegex).required().messages({
    'string.pattern.base': `"startTime" must be in HH:mm:ss format`,
    'any.required': `"startTime" is required`
  }),
  endTime: Joi.string().pattern(timeRegex).required().messages({
    'string.pattern.base': `"endTime" must be in HH:mm:ss format`,
    'any.required': `"endTime" is required`
  })
});

export function createTimeSlotValidator(req, res, next) {
  const { error } = createSlotSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
