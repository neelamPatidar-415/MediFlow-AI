const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('GET /api/auth/logout', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 200 and clears cookie when token cookie is present', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: 'logoutuser',
      email: 'logout@example.com',
      password: hash,
      fullname: { firstname: 'Out', lastname: 'User' }
    });

    // ✅ LOGIN (must match login contract)
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers['set-cookie']).toBeDefined();

    const cookie = loginRes.headers['set-cookie'];

    // ✅ LOGOUT
    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');

    // cookie cleared
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/token=;/);
  });

  it('returns 200 even when no cookie is present', async () => {
    const res = await request(app).get('/api/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });

  it('returns 200 even when cookie is invalid', async () => {
    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', ['token=invalidtoken']);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });
});

