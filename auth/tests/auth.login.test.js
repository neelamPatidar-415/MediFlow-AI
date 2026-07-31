const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('POST /api/auth/login', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 200 and sets cookie for valid credentials', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: 'loginuser',
      email: 'login@example.com',
      password: hash,
      fullname: { firstname: 'Login', lastname: 'User' }
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'login successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 for invalid password', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: 'loginuser2',
      email: 'login2@example.com',
      password: hash,
      fullname: { firstname: 'Login2', lastname: 'User2' }
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: user.username, password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
  });
});
