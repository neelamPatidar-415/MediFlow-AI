const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('POST /api/auth/users/me/addresses', () => {
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
      addresses: []
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    cookie = loginRes.headers['set-cookie'];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 201 and adds address with valid data', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Address added successfully');
    expect(res.body).toHaveProperty('address');
    expect(res.body.address.Street).toBe('789 Elm St');
    expect(res.body.address.city).toBe('Chicago');
  });

  it('returns 400 when street is missing', async () => {
    const newAddress = {
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 when city is missing', async () => {
    const newAddress = {
      Street: '789 Elm St',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when state is missing', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when zip/pincode is missing', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch("zip is required");
  });

//   it('returns 400 when zip/pincode format is invalid (not numeric)', async () => {
//     const newAddress = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: 'ABCDE',
//       country: 'USA'
//     };

//     const res = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(newAddress);

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toMatch(/zip|pincode|numeric|digits/i);
//   });

//   it('returns 400 when zip/pincode is too short', async () => {
//     const newAddress = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: '123',
//       country: 'USA'
//     };

//     const res = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(newAddress);

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toMatch(/zip|pincode|length|digits/i);
//   });

//   it('returns 400 when zip/pincode is too long', async () => {
//     const newAddress = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: '123456789',
//       country: 'USA'
//     };

//     const res = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(newAddress);

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toMatch(/zip|pincode|length|digits/i);
//   });

  it('returns 400 when country is missing', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(400);
  });

//   it('returns 400 when phone number is provided but invalid format', async () => {
//     const newAddress = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: '60601',
//       country: 'USA',
//       phone: 'invalid'
//     };

//     const res = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(newAddress);

//     expect(res.statusCode).toBe(400);
//     expect(res.body.message).toMatch(/phone|digits|format/i);
//   });

//   it('accepts valid phone number with 10 digits', async () => {
//     const newAddress = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: '60601',
//       country: 'USA',
//       phone: '1234567890'
//     };

//     const res = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(newAddress);

//     expect(res.statusCode).toBe(201);
//   });

  it('returns 401 when no authentication token is provided', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .send(newAddress);

    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when invalid token is provided', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', 'token=invalidtoken')
      .send(newAddress);

    expect(res.statusCode).toBe(401);
  });

//   it('allows adding multiple addresses to same user', async () => {
//     const address1 = {
//       Street: '789 Elm St',
//       city: 'Chicago',
//       state: 'IL',
//       zip: '60601',
//       country: 'USA'
//     };

//     const res1 = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(address1);

//     expect(res1.statusCode).toBe(201);

//     const address2 = {
//       Street: '321 Pine St',
//       city: 'Boston',
//       state: 'MA',
//       zip: '02101',
//       country: 'USA'
//     };

//     const res2 = await request(app)
//       .post('/api/auth/users/me/addresses')
//       .set('Cookie', cookie)
//       .send(address2);

//     expect(res2.statusCode).toBe(201);
//     expect(res2.body.address.city).toBe('Boston');
//   });

  it('returns address with ID after successful creation', async () => {
    const newAddress = {
      Street: '789 Elm St',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'USA'
    };

    const res = await request(app)
      .post('/api/auth/users/me/addresses')
      .set('Cookie', cookie)
      .send(newAddress);

    expect(res.statusCode).toBe(201);
    expect(res.body.address).toHaveProperty('_id');
    expect(res.body.address._id).toBeDefined();
  });
});
