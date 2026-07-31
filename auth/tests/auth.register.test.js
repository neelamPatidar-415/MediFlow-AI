const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

describe('POST /api/auth/register', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user and return 201', async () => {
  const payload = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullname: { firstname: 'Test', lastname: 'User' }
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(payload);

  // HTTP status
  expect(res.statusCode).toBe(201);

  // Response shape
  expect(res.body).toHaveProperty('message', 'user created successfully');
  expect(res.body).toHaveProperty('user');

  // User object assertions
  expect(res.body.user).toHaveProperty('id');
  expect(res.body.user.username).toBe(payload.username);
  expect(res.body.user.email).toBe(payload.email);
  expect(res.body.user.role).toBeDefined();
  expect(res.body.user.fullname).toEqual(payload.fullname);

  // DB verification
  const user = await User.findOne({ email: payload.email });
  expect(user).not.toBeNull();
  expect(user.username).toBe(payload.username);
});


  it('should not create duplicate user', async () => {
    const payload = {
      username: 'testuser2',
      email: 'dup@example.com',
      password: 'password123',
      fullname: { firstname: 'Dup', lastname: 'User' }
    };
    await request(app).post('/api/auth/register').send(payload);
    const res = await request(app).post('/api/auth/register').send(payload);
    expect(res.statusCode).toBe(409);
  });
});
