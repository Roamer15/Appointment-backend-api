import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import path from 'path';
import { initializeDbSchema } from '../config/db.js';


describe('Auth - Registration', () => {
  before(async () => {
    // Clear test data
    await initializeDbSchema()
  });
  test('POST /auth/register - should register a new client with default image', async () => {
    const res = await request(app)
      .post('/auth/register')
      .field('firstName', 'Jane')
      .field('lastName', 'Doe')
      .field('email', `janedoe${Date.now()}@test.com`)
      .field('password', 'SecurePass123!')
      .field('role', 'client');

    assert.strictEqual(res.statusCode, 201);
    assert.match(res.body.message, /User registered successfully/i);
    assert.ok(res.body.user);
    assert.ok(res.body.user.id);
    assert.strictEqual(res.body.user.role, 'client');
  });

  test('POST /auth/register - should register a provider and expect nextStep', async () => {
    const res = await request(app)
      .post('/auth/register')
      .field('firstName', 'John')
      .field('lastName', 'Doe')
      .field('email', `provider${Date.now()}@test.com`)
      .field('password', 'StrongPass456!')
      .field('role', 'provider');

    assert.strictEqual(res.statusCode, 201);
    assert.match(res.body.message, /Basic user profile created/i);
    assert.ok(res.body.userId);
    assert.strictEqual(res.body.nextStep, '/auth/register/provider');
  });

  test('POST /auth/register - should reject if email already exists', async () => {
    const email = `dupe${Date.now()}@test.com`;

    // First registration
    await request(app)
      .post('/auth/register')
      .field('firstName', 'Dupe')
      .field('lastName', 'Test')
      .field('email', email)
      .field('password', 'DupePass123!')
      .field('role', 'client');

    // Second attempt
    const res = await request(app)
      .post('/auth/register')
      .field('firstName', 'Dupe')
      .field('lastName', 'Test')
      .field('email', email)
      .field('password', 'DupePass123!')
      .field('role', 'client');

    assert.strictEqual(res.statusCode, 409);
    assert.match(res.body.message, /Email already in use/i);
  });

  test('POST /auth/register - should upload profile image if provided', async () => {
    const res = await request(app)
      .post('/auth/register')
      .field('firstName', 'Image')
      .field('lastName', 'User')
      .field('email', `imageuser${Date.now()}@test.com`)
      .field('password', 'ImagePass456!')
      .field('role', 'client')
      .attach('profilePic', path.resolve('tests/test-image.webp'));

    assert.strictEqual(res.statusCode, 201);
    assert.ok(res.body.user);
    assert.match(res.body.message, /User registered successfully/i);
  });
});
