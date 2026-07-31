// Mock auth middleware so we can set `req.user.id` via `token` cookie
jest.mock('../Middlewares/auth.middleware', () => ({
  createAuthMiddleware: () => (req, res, next) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('token='));
    const userId = match ? match.split('=')[1] : null;
    req.user = { id: userId };
    next();
  }
}));

const request = require('supertest');
const mongoose = require('mongoose');
const orderModel = require('../models/order.model');
const app = require('../app');

const makeCookie = (userId) => `token=${userId}`;

describe('Orders API (integration against app)', ()=>{
  beforeEach(async () => {
    await orderModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /api/orders/:id returns order with timeline and paymentSummary', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await orderModel.create({
      user: userId,
      items: [{ productId: new mongoose.Types.ObjectId(), quantity: 1, price: { amount: 150, currency: 'INR' } }],
      status: 'PENDING',
      totalPrice: { amount: 150, currency: 'INR' },
      shippingAddress: { Street: 'S', city: 'C', state: 'S', zip: '12345', country: 'IN' }
    });

    const res = await request(app).get(`/api/orders/${order._id}`).set('Cookie', makeCookie(userId));
    expect(res.status).toBe(200);
    expect(res.body.order).toBeDefined();
    expect(Array.isArray(res.body.order.timeline)).toBe(true);
    expect(res.body.order.paymentSummary).toBeDefined();
  });

  test('GET /api/orders/me returns paginated list for customer', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    // create two orders for this user and one for another
    await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:10, currency:'INR'} }], totalPrice:{ amount:10, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' } });
    await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:20, currency:'INR'} }], totalPrice:{ amount:20, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' } });
    await orderModel.create({ user: new mongoose.Types.ObjectId(), items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:30, currency:'INR'} }], totalPrice:{ amount:30, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' } });

    const res = await request(app).get('/api/orders/me?page=1&limit=2').set('Cookie', makeCookie(userId));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
    expect(res.body.total).toBe(2);
  });

  test('POST /api/orders/:id/cancel allows buyer to cancel pending orders', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:10, currency:'INR'} }], totalPrice:{ amount:10, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' }, status: 'PENDING' });

    const res = await request(app).post(`/api/orders/${order._id}/cancel`).set('Cookie', makeCookie(userId));
    expect(res.status).toBe(200);
    expect(res.body.order.status).toBe('CANCELLED');
    expect(res.body.order.timeline.some(t => t.event === 'cancelled')).toBe(true);
  });

  test('POST /api/orders/:id/cancel rejects cancel for paid orders', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:10, currency:'INR'} }], totalPrice:{ amount:10, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' }, status: 'CONFIRMED' });

    const res = await request(app).post(`/api/orders/${order._id}/cancel`).set('Cookie', makeCookie(userId));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/cannot/i);
  });

  test('PATCH /api/orders/:id/address updates address when not paid', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:10, currency:'INR'} }], totalPrice:{ amount:10, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' }, status: 'PENDING' });
    const newAddr = { Street: '1 A St', city: 'X', state: 'S', zip: '12345', country: 'IN' };
    const res = await request(app).patch(`/api/orders/${order._id}/address`).set('Cookie', makeCookie(userId)).send({ shippingAddress: newAddr });
    expect(res.status).toBe(200);
    expect(res.body.order.shippingAddress).toMatchObject(newAddr);
  });

  test('PATCH /api/orders/:id/address rejects update after payment', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await orderModel.create({ user: userId, items:[{ productId: new mongoose.Types.ObjectId(), quantity:1, price:{ amount:10, currency:'INR'} }], totalPrice:{ amount:10, currency:'INR'}, shippingAddress:{ Street:'s', city:'c', state:'s', zip:'12345', country:'IN' }, status: 'CONFIRMED' });
    const res = await request(app).patch(`/api/orders/${order._id}/address`).set('Cookie', makeCookie(userId)).send({ shippingAddress: { city: 'X' } });
    expect(res.status).toBe(400);
  });
});
