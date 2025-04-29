import { test, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js'; // update to your actual Express app
import { query } from '../config/db.js';

const testUser = {
  firstName: 'Logan',
  lastName: 'Testman',
  email: 'logan.test@example.com',
  password: '123456789',
  profileImageUrl: ''
};

before(async () => {
  // Ensure test user exists before login test
  await query(`
    INSERT INTO clients (first_name, last_name, email, password, profile_image_url)
    VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5)
    ON CONFLICT (email) DO NOTHING
  `, [
    testUser.firstName,
    testUser.lastName,
    testUser.email,
    testUser.password,
    testUser.profileImageUrl
  ]);
});

after(async () => {
  await query('DELETE FROM clients WHERE email = $1', [testUser.email]);
});

test('POST /auth/login - should log in successfully with correct credentials', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });

  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.message, 'Login Successfull!');
  assert.ok(res.body.token, 'JWT token should be returned');
  assert.strictEqual(res.body.user.email, testUser.email);
});

test('POST /auth/login - should fail with wrong password', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: testUser.email,
      password: 'wrongpassword'
    });

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.message, 'Invalid password');
});

test('POST /auth/login - should fail with non-existent email', async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({
      email: 'fakeuser@example.com',
      password: 'somepassword'
    });

  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.message, 'Account not found, invalid credentials');
});
