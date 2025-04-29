import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js'; // Make sure your app export is correct!

describe('Authentication - Register', () => {

  test('POST /auth/register - should register a new client successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: `testuser${Date.now()}@example.com`, // Unique email every time
        password: 'Passw0rd123',
        profileImageUrl: ''
      });

    console.log('DEBUG register response:', response.body);

    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.body.message, 'User registered successfully');
    assert.ok(response.body.user.id);
    assert.ok(response.body.user.name);
  });

});
