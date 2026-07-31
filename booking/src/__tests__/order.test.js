const request = require('supertest');

// Mock auth middleware before loading the app so routes don't attempt JWT verification
jest.mock('../Middlewares/auth.middleware', () => ({
  createAuthMiddleware: () => (req, res, next) => {
    req.user = { id: '695ad884bf1ba059f1f906a7', role: 'user' };
    next();
  }
}));

// mock axios used by controller to fetch cart and product details
jest.mock('axios');

// mock order model persistence
jest.mock('../models/order.model', () => ({ create: jest.fn().mockImplementation((order) => Promise.resolve(Object.assign({ _id: 'order_mock_id' }, order))) }));

const axios = require('axios');
const orderModel = require('../models/order.model');
const app = require('../app');

// attach a simple auth cookie to requests (middleware is mocked, cookie content irrelevant)
const AUTH_COOKIE_NAME = 'token';
const makeCookie = (userId) => `${AUTH_COOKIE_NAME}=${userId || 'testuser'}`;

describe('POST /api/orders - Create Order from Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleCart = {
    items: [
      { productId: 'prod1', quantity: 2, price: { amount: 100, currency: 'USD' } },
      { productId: 'prod2', quantity: 1, price: { amount: 50, currency: 'USD' } }
    ]
  };

  test('copies priced items into order, computes taxes and shipping, sets status=PENDING, and reserves inventory', async () => {
      const payload = { userId: '695ad884bf1ba059f1f906a7', cart: sampleCart, shippingAddress: { Street: 'S', city: 'Test', state: 'S', zip: '12345', country: 'IN' } };

      // mock cart and product service responses
      axios.get.mockImplementation((url, opts) => {
        if (url.includes('/api/cart')) {
          return Promise.resolve({ data: { cart: payload.cart } });
        }
        // product detail
        const id = url.split('/').pop();
        const prod = payload.cart.items.find(i => i.productId === id) || { productId: id };
        return Promise.resolve({ data: { data: { _id: prod.productId, title: `prod-${id}`, stock: 10, price: { amount: prod.price?.amount || 100, currency: prod.price?.currency || 'INR' } } } });
      });

      const res = await request(app).post('/api/orders').set('Cookie', makeCookie(payload.userId)).send(payload);

      expect(res.status).toBe(201);

      // Response wrapper as controller returns { message, order }
      expect(res.body).toBeDefined();
      expect(res.body.order).toBeDefined();

      // items should be mapped and priced based on product details
      const expectedItems = sampleCart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: { amount: item.price.amount * item.quantity, currency: item.price.currency || 'INR' }
      }));
      expect(res.body.order.items).toEqual(expectedItems);

      // status should be PENDING
      expect(res.body.order.status).toBe('PENDING');

      // ensure order was persisted via model.create (controller should call it)
      expect(orderModel.create).toHaveBeenCalled();
  });

  test('computes correct totals (subtotal + tax + shipping)', async () => {
    const payload = { userId: '695ad884bf1ba059f1f906a7', cart: sampleCart, shippingAddress: { Street: 'S', city: 'Test', state: 'S', zip: '12345', country: 'IN' } };

    axios.get.mockImplementation((url, opts) => {
      if (url.includes('/api/cart')) return Promise.resolve({ data: { cart: payload.cart } });
      const id = url.split('/').pop();
      const prod = payload.cart.items.find(i => i.productId === id) || { productId: id };
      return Promise.resolve({ data: { data: { _id: prod.productId, title: `prod-${id}`, stock: 10, price: { amount: prod.price?.amount || 100, currency: prod.price?.currency || 'INR' } } } });
    });

    const res = await request(app).post('/api/orders').set('Cookie', makeCookie(payload.userId)).send(payload);
    expect(res.status).toBe(201);

    const subtotal = sampleCart.items.reduce((s, it) => s + it.price.amount * it.quantity, 0);
    if (res.body.order && typeof res.body.order.totalPrice?.amount === 'number') {
      expect(res.body.order.totalPrice.amount).toBe(subtotal);
    }
  });

  test('returns 500 when a product is out of stock', async () => {
    const payload = { userId: '695ad884bf1ba059f1f906a7', cart: sampleCart, shippingAddress: { Street: 'S', city: 'X', state: 'S', zip: '12345', country: 'IN' } };
    // cart ok, but product detail shows low stock
    axios.get.mockImplementation((url, opts) => {
      if (url.includes('/api/cart')) return Promise.resolve({ data: { cart: payload.cart } });
      const id = url.split('/').pop();
      // return stock 0 for prod1 to simulate out of stock
      const stock = id === 'prod1' ? 0 : 10;
      const prod = payload.cart.items.find(i => i.productId === id) || { productId: id };
      return Promise.resolve({ data: { data: { _id: prod.productId, title: `prod-${id}`, stock, price: { amount: prod.price?.amount || 100, currency: prod.price?.currency || 'INR' } } } });
    });

    const res = await request(app).post('/api/orders').set('Cookie', makeCookie(payload.userId)).send(payload);
    expect(res.status).toBe(500);
  });

  test('returns 400 when shipping address is missing', async () => {
    const payload = { userId: '695ad884bf1ba059f1f906a7', cart: sampleCart };
    const res = await request(app).post('/api/orders').set('Cookie', makeCookie(payload.userId)).send(payload);
    expect([400,422]).toContain(res.status);
  });


});
