const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('GET /api/auth/me', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 200 and user info when token cookie is valid', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: 'meuser',
      email: 'me@example.com',
      password: hash,
      fullname: { firstname: 'Me', lastname: 'User' }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers['set-cookie']).toBeDefined();

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(user.email);
  });

  it('returns 401 when no cookie is present', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when cookie is invalid', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', ['token=invalidtoken']);

    expect(res.statusCode).toBe(401);
  });
});
