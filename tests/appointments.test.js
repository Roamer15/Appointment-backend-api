// import { test, describe } from 'node:test';
// import assert from 'node:assert';
// import request from 'supertest';
// import app from '../app.js'; 

// const clientToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYTliNThiNTgtZTQ1NS00ZGZlLTg4YzgtMTZjZDA4NzhjMjEwIiwiZW1haWwiOiJicmlhbkBnbWFpbC5jb20ifSwiaWF0IjoxNzQ1ODUwMDg1LCJleHAiOjE3NDU4NTcyODV9.ydHiUHu3ASv4oFrwbVO8B_CWCT5iwBHmUpWepxpBBws'
// const providerId = '89da2cd5-1c59-4f8d-b374-f95ee0d6f533'
// describe('Booking Appointments', () => {
//     test('POST /booking - should allow client to book appointment', async () => {
//       const response = await request(app)
//         .post('/booking')
//         .set('Authorization', clientToken)
//         .send({
//           timeslotId: '618b47c2-ac87-41b0-a88c-1a039fe85a1d' // Make sure it's available
//         });
  
//       assert.strictEqual(response.statusCode, 201);
//       assert.ok(response.body.slot || response.body.appointment);
//     });
//   });
  
  
//   describe('View Client Appointments', () => {
//     test('GET /view-bookings - should list client booked appointments', async () => {
//       const response = await request(app)
//         .get('/view-bookings')
//         .set('Authorization', clientToken);
  
//       assert.strictEqual(response.statusCode, 200);
//       assert.ok(Array.isArray(response.body.appointments));
//     });
//   });
  
  
//   describe('Provider Views Appointments', () => {
//     test('GET /provider/view-bookings/:id - should list provider booked appointments', async () => {
//       const response = await request(app)
//         .get(`/provider/view-bookings/${providerId}`)
  
//       assert.strictEqual(response.statusCode, 200);
//       assert.ok(Array.isArray(response.body.appointments));
//     });
//   });
  

//   describe('Client Cancels Appointment', () => {
//     test('PATCH /:appointmentId/cancel - should cancel appointment', async () => {
//       const response = await request(app)
//         .patch(`/your-booked-appointment-id/cancel`)
//         .set('Authorization', clientToken);
  
//       assert.strictEqual(response.statusCode, 200);
//       assert.strictEqual(response.body.message, "Appointment canceled successfully");
//     });
//   });

//   describe('Provider Cancels Appointment', () => {
//     test('PATCH /provider/:providerId/:appointmentId/cancel - provider cancels appointment', async () => {
//       const response = await request(app)
//         .patch(`/provider/${providerId}/${'your-appointment-id'}/cancel`)
  
//       assert.strictEqual(response.statusCode, 200);
//       assert.ok(response.body.appointments);
//     });
//   });
  
