const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

describe('DELETE /api/auth/users/me/addresses/:addressId', () => {
  let user;
  let cookie;
  let address1Id;
  let address2Id;

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
          country: 'USA'
        },
        {
          Street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          country: 'USA'
        }
      ]
    });

    // Get the address IDs
    address1Id = user.addresses[0]._id;
    address2Id = user.addresses[1]._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password });

    cookie = loginRes.headers['set-cookie'];
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('returns 200 and deletes address successfully with valid addressId', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Address deleted successfully');
  });

  it('removes the address from user addresses list', async () => {
    await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.addresses.length).toBe(1);
    expect(updatedUser.addresses[0].city).toBe('Los Angeles');
  });

  it('returns 404 when addressId does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${fakeId}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/not found|does not exist/i);
  });

  it('returns 400 when addressId format is invalid', async () => {
    const res = await request(app)
      .delete('/api/auth/users/me/addresses/invalidid')
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(400);
  });

  it('returns 401 when no authentication token is provided', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`);

    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when invalid token is provided', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', 'token=invalidtoken');

    expect(res.statusCode).toBe(401);
  });

  it('prevents user from deleting another users address', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const anotherUser = await User.create({
      username: 'otheruser',
      email: 'other@example.com',
      password: hash,
      fullname: { firstname: 'Other', lastname: 'User' }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: anotherUser.email, password });

    const otherCookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', otherCookie);

    expect(res.statusCode).toBe(404);
  });

  it('allows deleting multiple addresses one by one', async () => {
    const res1 = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    expect(res1.statusCode).toBe(200);

    const res2 = await request(app)
      .delete(`/api/auth/users/me/addresses/${address2Id}`)
      .set('Cookie', cookie);

    expect(res2.statusCode).toBe(200);

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.addresses.length).toBe(0);
  });

  it('returns 404 when trying to delete already deleted address', async () => {
    await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(404);
  });

  it('returns deleted address information in response', async () => {
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', cookie);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deletedAddress');
    expect(res.body.deletedAddress.city).toBe('New York');
  });

  it('only allows owner to delete their own address', async () => {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);
    const secondUser = await User.create({
      username: 'seconduser',
      email: 'second@example.com',
      password: hash,
      fullname: { firstname: 'Second', lastname: 'User' },
      addresses: [
        {
          Street: '999 Fake St',
          city: 'Fake City',
          state: 'FC',
          zip: '99999',
          country: 'Fake'
        }
      ]
    });

    const secondCookie = (await request(app)
      .post('/api/auth/login')
      .send({ email: secondUser.email, password })).headers['set-cookie'];

    // Try to delete first user's address with second user's token
    const res = await request(app)
      .delete(`/api/auth/users/me/addresses/${address1Id}`)
      .set('Cookie', secondCookie);

    expect(res.statusCode).toBe(404);

    // Verify first user's address still exists
    const firstUserRefresh = await User.findById(user._id);
    expect(firstUserRefresh.addresses.length).toBe(2);
  });
});
