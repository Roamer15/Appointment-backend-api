import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import logger from '../utils/logger.js';
import app from '../app.js';
import { query } from '../config/db.js'; 

let providerId;
let timeSlotId;

// const providerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYTliNThiNTgtZTQ1NS00ZGZlLTg4YzgtMTZjZDA4NzhjMjEwIiwiZW1haWwiOiJicmlhbkBnbWFpbC5jb20ifSwiaWF0IjoxNzQ1ODUwMDg1LCJleHAiOjE3NDU4NTcyODV9.ydHiUHu3ASv4oFrwbVO8B_CWCT5iwBHmUpWepxpBBws'

describe('Provider Time Slot Management', () => {

  test('Setup: Create a test provider', async () => {
    const result = await query(`
      INSERT INTO providers (first_name, last_name, email, password, specialty)
      VALUES ('ProviderTest', 'User', 'providertest${Date.now()}@example.com', 'password', 'driver')
      RETURNING id
    `);
    providerId = result.rows[0].id;
    console.log('DEBUG created providerId:', providerId);
  });
  
  test('POST /providers/:id/create-timeslots - should create a time slot successfully', async () => {
    console.log('DEBUG created providerId:', providerId);
    const response = await request(app)
      .post(`/timeslots/providers/${providerId}/create-timeslots`)
      //.set('Authorization', providerToken)
      .send({
        day: '2025-05-01',
        startTime: '09:00:00',
        endTime: '09:30:00'
      });

    logger.info('DEBUG create slot response:', response.body);

    assert.strictEqual(response.status, 201);
    assert.ok(response.body.slot);
    assert.strictEqual(response.body.slot.provider_id, providerId);

    timeSlotId = response.body.slot.id; // Save for later cleanup
  });

  test('GET /timeslots/providers/:id/view-timeslots - should return time slots for a provider', async () => {
    const response = await request(app)
      .get(`/timeslots/providers/${providerId}/view-timeslots`)
      .expect(200);

      logger.info(response.body)
    assert.ok(Array.isArray(response.body.slots));
  });

  test('PUT /providers/:providerId/update-timeslot/:slotId - should update a time slot', async () => {
    const updatedTimeSlot = {
      day: '2025-05-02',
      startTime: '12:00:00',
      endTime: '12:30:00'
    };
  
    const response = await request(app)
      .put(`/timeslots/providers/${providerId}/update-timeslot/${timeSlotId}`)
      .send(updatedTimeSlot)
      .expect(200);

      logger.info(response.body)
      assert.ok(response.body.message, 'Expected response to have a message property');
      assert.strictEqual(response.body.message, 'Time slot updated successfully');
      
      assert.ok(response.body.updatedSlot.day, 'Expected updatedSlot to have a day property');
      assert.strictEqual(response.body.updatedSlot.day, updatedTimeSlot.day);
  });
  
  test('should return available time slots for a provider', async () => {
    const response = await request(app)
      .get(`/timeslots/search/providers/${providerId}/available-slots?from=2025-04-24&to=2025-08-30`)

    assert.strictEqual(response.status, 200);
    logger.info(response.body.availableSlots[0])
    assert.ok(Array.isArray(response.body.availableSlots));
    assert.ok(response.body.availableSlots.length > 0);
    
  });

  test('DELETE /providers/:providerId/delete-timeslot/:slotId - should delete a time slot', async () => {
    const response = await request(app)
      .delete(`/timeslots/providers/${providerId}/delete-timeslot/${timeSlotId}`)
      .expect(200);
  
      assert.ok(response.body.hasOwnProperty('message'), 'Response should have "message" property');
      assert.strictEqual(response.body.message, 'Time slot deleted successfully');
  });
  

  test('Cleanup: Delete created time slot and provider', async () => {
    if (timeSlotId) {
      await query('DELETE FROM time_slots WHERE id = $1', [timeSlotId]);
    }
    if (providerId) {
      await query('DELETE FROM providers WHERE id = $1', [providerId]);
    }
  });

});
