const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('GET /api/auth/users/me/addresses', () => {
  let user;
  let cookie;

  beforeEach(async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);

    user = await User.create({
      username: 'addressuser',
      email: 'address@example.com',
      password: hash,
      fullname: { firstname: 'Address', lastname: 'User' },
      addresses: [
        {
          Street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'USA',
          isdefault: true
        },
        {
          Street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'USA',
          isdefault: false
        }
      ]
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    cookie = loginRes.headers['set-cookie'];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 200 and list of all addresses for authenticated user', async () => {
    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Addresses retrieved successfully');
    expect(Array.isArray(res.body.addresses)).toBe(true);
    expect(res.body.addresses.length).toBe(2);
  });

  it('returns address details with all fields including isdefault', async () => {
    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.addresses[0]).toHaveProperty('Street', '123 Main St');
    expect(res.body.addresses[0]).toHaveProperty('city', 'New York');
    expect(res.body.addresses[0]).toHaveProperty('state', 'NY');
    expect(res.body.addresses[0]).toHaveProperty('zip', '10001');
    expect(res.body.addresses[0]).toHaveProperty('country', 'USA');
    expect(res.body.addresses[0]).toHaveProperty('isdefault', true);
  });

  it('returns default false when isdefault is not explicitly set', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: 'noaddressuser',
      email: 'noaddress@example.com',
      password: hash,
      fullname: { firstname: 'No', lastname: 'Address' },
      addresses: [
        {
          Street: '789 Pine St',
          city: 'Austin',
          state: 'TX',
          zip: '73301',
          country: 'USA'
        }
      ]
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password });

    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.statusCode).toBe(200);
    expect(res.body.addresses[0]).toHaveProperty('isdefault', false);
  });

  it('returns 200 with empty array when user has no addresses', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: 'emptyaddressuser',
      email: 'empty@example.com',
      password: hash,
      fullname: { firstname: 'Empty', lastname: 'User' },
      addresses: []
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: newUser.email, password });

    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', loginRes.headers['set-cookie']);

    expect(res.statusCode).toBe(200);
    expect(res.body.addresses).toEqual([]);
  });

  it('returns 401 when no authentication token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/users/me/addresses');

    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when invalid token is provided', async () => {
    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', 'token=invalidtoken');

    expect(res.statusCode).toBe(401);
  });

  it('returns correct address IDs for updating/deleting', async () => {
    const res = await request(app)
      .get('/api/auth/users/me/addresses')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body.addresses[0]).toHaveProperty('_id');
    expect(res.body.addresses[0]._id).toBeDefined();
  });
});
