import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { query } from '../config/db.js';
import logger from '../utils/logger.js';

let providerToken, providerId, slotId;

const testProvider = {
  firstName: 'Slot',
  lastName: 'Tester',
  email: `provider${Date.now()}@test.com`,
  password: 'SecureP@ss123!',
  role: 'provider'
};

const email = `provider${Date.now()}@test.com`

describe('Timeslot Endpoints', () => {
    before(async () => {
        // Register provider
        const res = await request(app)
          .post('/auth/register')
          .field('firstName', testProvider.firstName)
          .field('lastName', testProvider.lastName)
          .field('email', testProvider.email)
          .field('password', testProvider.password)
          .field('role', testProvider.role);
      
        providerId = res.body.userId;
      
        // ✅ Mark the user as verified directly in the DB
        await query(`UPDATE users SET is_verified = true WHERE id = $1`, [providerId]);
      
        // Complete provider registration phase 2
        await request(app).post('/auth/register/provider').send({
          userId: providerId,
          specialty: 'Testing',
          bio: 'I test slots'
        });
      
        // Log in (should work now since is_verified = true)
        const loginRes = await request(app).post('/auth/login').send({
          email: testProvider.email,
          password: testProvider.password
        });
      
        providerToken = loginRes.body.token;
        logger.info(`🧪 Provider test login complete. Token: ${providerToken}`);
      });
      
  test('POST /timeslots/create - should create a new time slot', async () => {
    const res = await request(app)
      .post('/timeslots/create')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        day: '2025-06-01',
        startTime: '10:00:00',
        endTime: '10:30:00'
      });

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.message, 'Time slot created');
    assert.ok(res.body.slot.id);
    slotId = res.body.slot.id;
  });

  test('GET /timeslots/view - should fetch provider time slots', async () => {
    const res = await request(app)
      .get('/timeslots/view')
      .set('Authorization', `Bearer ${providerToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.slots));
  });

  test('GET /timeslots/available-slots - should return available slots', async () => {
    const res = await request(app)
      .get('/timeslots/available-slots')
      .set('Authorization', `Bearer ${providerToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.availableSlots));
  });

  test('PUT /timeslots/update/:slotId - should update the time slot', async () => {
    const res = await request(app)
      .put(`/timeslots/update/${slotId}`)
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        day: '2025-06-02',
        startTime: '11:00:00',
        endTime: '11:30:00'
      });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.message, 'Time slot updated successfully');
  });

  test('DELETE /timeslots/delete/:slotId - should delete the time slot', async () => {
    const res = await request(app)
      .delete(`/timeslots/delete/${slotId}`)
      .set('Authorization', `Bearer ${providerToken}`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.message, 'Time slot deleted successfully');
  });

  after(async () => {
    await query(`DELETE FROM providers WHERE user_id = $1`, [providerId]);
    await query(`DELETE FROM users WHERE id = $1`, [providerId]);
  });
});

