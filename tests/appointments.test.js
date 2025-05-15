// import { test, describe } from 'node:test';
// import assert from 'node:assert/strict';
// import request from 'supertest';
// import app from '../app.js';
// import { query } from '../config/db.js';

// let clientToken, providerId, timeslotId;

// describe('Appointment Booking', () => {
//   // Setup test client and provider
//   test('Setup: Create client, provider and time slot', async () => {
//     // Create client
//     const clientRes = await request(app)
//       .post('/auth/register')
//       .send({
//         firstName: 'Test',
//         lastName: 'Client',
//         email: 'client@example.com',
//         password: 'password'
//       });
    
//     const loginRes = await request(app)
//       .post('/auth/login')
//       .send({ email: 'client@example.com', password: 'password' });

//     clientToken = loginRes.body.token;
//     const providerEmail = `provider${Date.now()}@gmail.com0`
//     // Create provider
//     const providerRes = await query(`
//       INSERT INTO providers (first_name, last_name, email, password, specialty)
//       VALUES ('Test', 'Provider', $1, 'password', 'therapist')
//       RETURNING id
//     `, [providerEmail]);
//     providerId = providerRes.rows[0].id;

//     // Create time slot
//     const slotRes = await query(`
//       INSERT INTO time_slots (provider_id, day, start_time, end_time)
//       VALUES ($1, '2025-05-01', '10:00:00', '10:30:00')
//       RETURNING id
//     `, [providerId]);
//     timeslotId = slotRes.rows[0].id;
//   });

//   // Booking test
//   test('POST /booking - should successfully book an appointment', async () => {
//     const res = await request(app)
//       .post('/appointment/booking')
//       .set('Authorization', `Bearer ${clientToken}`)
//       .send({ timeslotId });

//     assert.equal(res.status, 201);
//     assert.equal(res.body.message, 'Appointment booked successfully');
//     assert.equal(res.body.appointment.timeslot_id, timeslotId);
//   });

//   test('GET /view-bookings - should return the client\'s booked appointments', async () => {
//     const res = await request(app)
//       .get('/appointment/view-bookings')
//       .set('Authorization', `Bearer ${clientToken}`);
  
//     assert.equal(res.status, 200);
//     assert.ok(Array.isArray(res.body.appointments), 'appointments should be an array');
//     assert.ok(res.body.appointments.length > 0, 'should return at least one appointment');
    
//     const appointment = res.body.appointments[0];
//     assert.ok(appointment.appointment_id, 'appointment should have an id');
//     assert.ok(appointment.day, 'appointment should have a day');
//     assert.ok(appointment.start_time, 'appointment should have a start time');
//     assert.ok(appointment.end_time, 'appointment should have an end time');
//     assert.ok(appointment.provider_first_name, 'should include provider\'s first name');
//     assert.ok(appointment.provider_last_name, 'should include provider\'s last name');
//   });  

//   test('GET /provider/view-bookings/:id - should return the provider\'s booked appointments', async () => {
//     const res = await request(app)
//       .get(`/appointment/provider/view-bookings/${providerId}`);
  
//     assert.equal(res.status, 200);
//     assert.ok(Array.isArray(res.body.appointments), 'appointments should be an array');
//     assert.ok(res.body.appointments.length > 0, 'should return at least one appointment');
  
//     const appointment = res.body.appointments[0];
//     assert.ok(appointment.appointment_id, 'appointment should have an id');
//     assert.ok(appointment.day, 'appointment should have a day');
//     assert.ok(appointment.start_time, 'appointment should have a start time');
//     assert.ok(appointment.end_time, 'appointment should have an end time');
//     assert.ok(appointment.status, 'appointment should have a status');
//   });

//   test('PATCH /:appointmentId/cancel - should cancel the appointment', async () => {
//     // First fetch appointmentId from client's bookings
//     const fetchRes = await request(app)
//       .get('/appointment/view-bookings')
//       .set('Authorization', `Bearer ${clientToken}`);

//     const appointmentId = fetchRes.body.appointments?.[0]?.appointment_id;
//     assert.ok(appointmentId, 'appointment_id should be defined');

//     // Perform cancellation
//     const cancelRes = await request(app)
//       .patch(`/appointment/${appointmentId}/cancel`)
//       .set('Authorization', `Bearer ${clientToken}`);

//     // DEBUG response
//     console.log('Cancel Appointment Response:', cancelRes.body);

//     assert.equal(cancelRes.status, 200);
//     assert.equal(cancelRes.body.message, 'Appointment canceled successfully');
//     assert.ok(cancelRes.body.updatedAppointment, 'updatedAppointment should be present');
//     assert.equal(cancelRes.body.updatedAppointment.status, 'canceled');
//   });

//   test('PATCH /provider/:providerId/:appointmentId/cancel - should allow provider to cancel appointment', async () => {
//     // First, book a new appointment to cancel as provider
//     const newSlotRes = await query(`
//       INSERT INTO time_slots (provider_id, day, start_time, end_time)
//       VALUES ($1, '2025-05-03', '14:00:00', '14:30:00')
//       RETURNING id
//     `, [providerId]);

//     const newSlotId = newSlotRes.rows[0].id;

//     // Book the appointment
//     const bookingRes = await request(app)
//       .post('/appointment/booking')
//       .set('Authorization', `Bearer ${clientToken}`)
//       .send({ timeslotId: newSlotId });

//     const appointmentId = bookingRes.body.appointment.id;
//     assert.ok(appointmentId, 'appointment ID should exist');

//     // Provider cancels the appointment
//     const cancelRes = await request(app)
//       .patch(`/appointment/provider/${providerId}/${appointmentId}/cancel`);

//     // DEBUG
//     console.log('Provider cancel response:', cancelRes.body);

//     assert.equal(cancelRes.status, 200);
//     assert.ok(cancelRes.body.appointment, 'appointments should be present');
//     assert.equal(cancelRes.body.appointment.status, 'canceled');
//   });


//   // Cleanup
//   test('Cleanup: delete client, provider, time slot, and appointment', async () => {
//     await query(`DELETE FROM appointments WHERE timeslot_id = $1`, [timeslotId]);
//     await query(`DELETE FROM time_slots WHERE id = $1`, [timeslotId]);
//     await query(`DELETE FROM providers WHERE id = $1`, [providerId]);
//     await query(`DELETE FROM clients WHERE email = $1`, ['client@example.com']);
//   });
// });
