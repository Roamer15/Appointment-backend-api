import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { query } from '../config/db.js';
import logger from '../utils/logger.js';

let clientToken, providerToken;
let clientId, providerId;
let slotId, appointmentId;

describe('Appointment Endpoints', () => {
  before(async () => {
    // Register client
    const clientEmail = `client${Date.now()}@test.com`;
    const clientRes = await request(app)
      .post('/auth/register')
      .field('firstName', 'Test')
      .field('lastName', 'Client')
      .field('email', clientEmail)
      .field('password', 'Test@123')
      .field('role', 'client');

    clientId = clientRes.body.user.id;
    await query(`UPDATE users SET is_verified = true WHERE id = $1`, [clientId]);

    const clientLogin = await request(app)
      .post('/auth/login')
      .send({ email: clientEmail, password: 'Test@123' });
    clientToken = clientLogin.body.token;

    // Register provider
    const providerEmail = `provider${Date.now()}@test.com`;
    const providerRes = await request(app)
      .post('/auth/register')
      .field('firstName', 'Doc')
      .field('lastName', 'Provider')
      .field('email', providerEmail)
      .field('password', 'Test@123')
      .field('role', 'provider');

    providerId = providerRes.body.userId;
    await query(`UPDATE users SET is_verified = true WHERE id = $1`, [providerId]);

    await request(app).post('/auth/register/provider').send({
      userId: providerId,
      specialty: 'Dermatology',
      bio: 'Skincare expert'
    });

    const providerLogin = await request(app)
      .post('/auth/login')
      .send({ email: providerEmail, password: 'Test@123' });
    providerToken = providerLogin.body.token;

    // Create a timeslot
    const slotRes = await request(app)
      .post('/timeslots/create')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        day: '2025-06-01',
        startTime: '10:00:00',
        endTime: '10:30:00'
      });

    slotId = slotRes.body.slot.id;
    logger.info(`${slotId} found`)
  });

  test('POST /appointments/booking - should book an appointment', async () => {
    const res = await request(app)
      .post('/appointment/booking')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ timeslotId: slotId });

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.message, 'Appointment booked successfully');
    appointmentId = res.body.appointment.id;
  });

  test('GET /appointment/view - should return client appointments', async () => {
    const res = await request(app)
      .get('/appointment/view')
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.appointments));
  });

  test('GET /appointment/provider/view - should return provider appointments', async () => {
    const res = await request(app)
      .get('/appointment/provider/view')
      .set('Authorization', `Bearer ${providerToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.appointments));
  });

  test('PATCH /appointment/reschedule/:id - should reschedule the appointment', async () => {
    // Create a new timeslot
    const newSlotRes = await request(app)
      .post('/timeslots/create')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        day: '2025-06-02',
        startTime: '11:00:00',
        endTime: '11:30:00'
      });

    const newSlotId = newSlotRes.body.slot.id;

    const res = await request(app)
      .patch(`/appointment/reschedule/${appointmentId}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ newTimeslotId: newSlotId });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.message, 'Appointment rescheduled successfully');
  });

  test('PATCH /appointment/cancel/:id - should cancel the appointment', async () => {
    const res = await request(app)
      .patch(`/appointment/cancel/${appointmentId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.message, 'Appointment canceled successfully');
  });

  after(async () => {
    await query(`DELETE FROM appointments WHERE user_id = $1 OR provider_id = $1`, [clientId]);
    await query(`DELETE FROM time_slots WHERE provider_id = $1`, [providerId]);
    await query(`DELETE FROM providers WHERE user_id = $1`, [providerId]);
    await query(`DELETE FROM users WHERE id = $1 OR id = $2`, [clientId, providerId]);
  });
});
