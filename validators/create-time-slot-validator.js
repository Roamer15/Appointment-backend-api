import Joi from 'joi';
import moment from 'moment'; // For easier date/time comparison

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/; // HH:mm:ss

const createSlotSchema = Joi.object({
  day: Joi.date().iso().min('now').required().messages({
    'date.base': `"day" must be a valid ISO date`,
    'any.required': `"day" is required`,
    'date.min': 'The date must be today or a future date.'
  }),
  startTime: Joi.string().pattern(timeRegex).required()
    .custom((value, helpers) => {
      const now = moment();
      const day = helpers.state.ancestors[0].day;
      const isToday = moment(day).isSame(now, 'day');

      if (isToday) {
        const startDateTime = moment(`${moment(day).format('YYYY-MM-DD')}T${value}`);
        if (startDateTime.isBefore(now)) {
          return helpers.error('startTime.invalid');
        }
      }
      return value;
    })
    .messages({
      'string.pattern.base': `"startTime" must be in HH:mm:ss format`,
      'any.required': `"startTime" is required`,
      'startTime.invalid': 'Start time must be later than the current time for today.'
    }),
  endTime: Joi.string().pattern(timeRegex).required()
    .custom((value, helpers) => {
      const startTime = helpers.state.ancestors[0].startTime;
      const day = helpers.state.ancestors[0].day;
      const startDateTime = moment(`${moment(day).format('YYYY-MM-DD')}T${startTime}`);
      const endDateTime = moment(`${moment(day).format('YYYY-MM-DD')}T${value}`);

      if (endDateTime.isSameOrBefore(startDateTime)) {
        return helpers.error('endTime.invalid');
      }
      return value;
    })
    .messages({
      'string.pattern.base': `"endTime" must be in HH:mm:ss format`,
      'any.required': `"endTime" is required`,
      'endTime.invalid': 'End time must be later than the start time.'
    })
});

export function createTimeSlotValidator(req, res, next) {
  const { error } = createSlotSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}
