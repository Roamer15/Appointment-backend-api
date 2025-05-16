import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { query } from '../config/db.js';

let token, userId, providerId;

describe('Profile Endpoints', () => {
  before(async () => {
    const email = `profile${Date.now()}@test.com`;

    // Register a provider
    const registerRes = await request(app).post('/auth/register')
      .field('firstName', 'Profile')
      .field('lastName', 'Test')
      .field('email', email)
      .field('password', 'SecureP@ss123!')
      .field('role', 'provider');
    
    userId = registerRes.body.userId;

    // Mark as verified
    await query(`UPDATE users SET is_verified = TRUE WHERE id = $1`, [userId]);

    // Phase 2
    await request(app).post('/auth/register/provider').send({
      userId,
      specialty: 'API Testing',
      bio: 'I test profile endpoints'
    });

    // Login to get token
    const loginRes = await request(app).post('/auth/login').send({
      email,
      password: 'SecureP@ss123!'
    });

    token = loginRes.body.token;
    providerId = loginRes.body.user.providerId;

  });

  test('GET /profile - should return logged-in user profile', async () => {
    const res = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);
    
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.id, userId);
    assert.equal(res.body.firstName, 'Profile');
    assert.ok(res.body.providerDetails.specialty);
  });

  test('PATCH /profile/update - should update profile info', async () => {
    const res = await request(app)
      .patch('/profile/update')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'UpdatedName',
        specialty: 'Updated Specialty'
      });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.user.first_name, 'UpdatedName');
    assert.equal(res.body.user.providerDetails.specialty, 'Updated Specialty');
  });

  test('GET /profile/providers/:providerId - should return public provider profile', async () => {
    const res = await request(app)
      .get(`/profile/providers/${providerId}`);

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.firstName, 'UpdatedName');
    assert.equal(res.body.specialty, 'Updated Specialty');
  });

  after(async () => {
    await query('DELETE FROM providers WHERE id = $1', [providerId]);
    await query('DELETE FROM users WHERE id = $1', [userId]);
  });
});
