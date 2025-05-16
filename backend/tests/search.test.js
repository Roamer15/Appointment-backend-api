import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import { query } from '../config/db.js';

let clientToken;
let providerUserId, providerId;

describe('GET /profile/providers - Provider Search', () => {
  before(async () => {
    // Creation of provider user
    const email = `search${Date.now()}@test.com`;
    const regRes = await request(app).post('/auth/register')
      .field('firstName', 'Search')
      .field('lastName', 'Doctor')
      .field('email', email)
      .field('password', 'Test123456!')
      .field('role', 'provider');

    providerUserId = regRes.body.userId;
    await query(`UPDATE users SET is_verified = true WHERE id = $1`, [providerUserId]);

    const providerRes = await request(app).post('/auth/register/provider').send({
      userId: providerUserId,
      specialty: 'Therapy',
      bio: 'Searchable provider'
    });

    providerId = providerRes.body.providerId;

    // Creation of a client to perform the search
    const clientEmail = `client${Date.now()}@test.com`;
    const clientRes = await request(app).post('/auth/register')
      .field('firstName', 'Client')
      .field('lastName', 'Tester')
      .field('email', clientEmail)
      .field('password', 'Test123456!')
      .field('role', 'client');

    const clientUserId = clientRes.body.user.id;

    await query(`UPDATE users SET is_verified = true WHERE id = $1`, [clientUserId]);

    const loginRes = await request(app).post('/auth/login').send({
      email: clientEmail,
      password: 'Test123456!'
    });

    clientToken = loginRes.body.token;
  });

  test('should return all providers when no filters are applied', async () => {
    const res = await request(app)
      .get('/search/providers')
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.providers));
    assert.ok(res.body.providers.length >= 1);
  });

  test('should return providers matching name filter', async () => {
    const res = await request(app)
      .get('/search/providers?name=Search')
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(res.body.providers.some(p => p.first_name === 'Search'));
  });

  test('should return providers matching specialty filter', async () => {
    const res = await request(app)
      .get('/search/providers?specialty=Therapy')
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.ok(res.body.providers.some(p => p.specialty === 'Therapy'));
  });

  test('should return empty array if no match', async () => {
    const res = await request(app)
      .get('/search/providers?specialty=nonexistentspecialty')
      .set('Authorization', `Bearer ${clientToken}`);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.providers, []);
  });

  after(async () => {
    await query('DELETE FROM providers WHERE id = $1', [providerId]);
    await query('DELETE FROM users WHERE id = $1', [providerUserId]);
  });
});
