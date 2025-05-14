import Joi from "joi"

const bookAppointment = Joi.object({
    timeslotId: Joi.string().uuid({ version: ['uuidv4'] }).required()
})

export default function slotIdValidator(req, res, next){
    const {error} = bookAppointment.validate(req.body)
    if(error){
        return res.status(400).json({ message: error.details[0].message })
    }
    next()
}
// validators/appointmentValidators.js
const rescheduleSchema = Joi.object({
    newTimeslotId: Joi.string().uuid().required().messages({
      'string.guid': 'Invalid timeslot ID format',
      'any.required': 'New timeslot ID is required'
    })
  });

export function rescheduleAppointmentValidator(req, res, next){
    const {error} = rescheduleSchema.validate(req.body)
    if(error) {
        return res.status(400).json({message: error.details[0].message})
    }
    next()
}