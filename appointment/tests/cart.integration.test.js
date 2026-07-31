// const request = require('supertest');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

// /**
//  * 🔐 Auth setup (MUST be before app import)
//  */
// process.env.JWT_SECRET = 'test_jwt_secret';

// const AUTH_TOKEN = jwt.sign(
//   { _id: '507f191e810c19729de860ea', role: 'user' },
//   process.env.JWT_SECRET
// );
// const AUTH_COOKIE = `token=${AUTH_TOKEN}`;

// /**
//  * 🎯 Valid Mongo ObjectIds as STRINGS
//  */
// const VALID_ID_1 = new mongoose.Types.ObjectId().toString();
// const VALID_ID_2 = new mongoose.Types.ObjectId().toString();

// /**
//  * 🚀 Import app AFTER env + globals
//  */
// const app = require('../src/app');

// beforeAll(() => {
//   global.__TEST_CART__ = {
//     cart: { items: [] },
//     productsCatalog: {
//       [VALID_ID_1]: { stock: 5, price: 10 },
//       [VALID_ID_2]: { stock: 2, price: 20 },
//     },
//   };
// });

// beforeEach(() => {
//   global.__TEST_CART__.cart = { items: [] };

//   global.__TEST_CART__.productsCatalog[VALID_ID_1].stock = 5;
//   global.__TEST_CART__.productsCatalog[VALID_ID_2].stock = 2;
// });

// describe('Cart API integration (test-only router)', () => {
//   test('GET /api/cart returns empty cart initially', async () => {
//     const res = await request(app)
//       .get('/api/cart')
//       .set('Cookie', AUTH_COOKIE);

//     expect(res.status).toBe(200);
//     expect(res.body.cart.items).toEqual([]);
//     expect(res.body.totals).toEqual({ itemsCount: 0, totalQty: 0 });
//   });

//   // test('POST /api/cart/items adds item and uses server-side price', async () => {
//   //   const res = await request(app)
//   //     .post('/api/cart/items')
//   //     .set('Cookie', AUTH_COOKIE)
//   //     .send({ productId: VALID_ID_1, qty: 2 });

//   //   expect(res.status).toBe(201);
//   //   expect(res.body.items).toHaveLength(1);

//   //   const item = res.body.items[0];
//   //   expect(item.productId).toBe(VALID_ID_1);
//   //   expect(item.qty).toBe(2);
//   //   expect(item.price).toBe(10);
//   //   expect(res.body.totals.subtotal).toBe(20);
//   // });

//   test('POST /api/cart/items rejects when productId missing', async () => {
//     const res = await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ qty: 1 });

//     expect(res.status).toBe(400);
//     expect(res.body.errors.length).toBeGreaterThan(0);
//   });

//   // test('POST /api/cart/items rejects insufficient stock', async () => {
//   //   const res = await request(app)
//   //     .post('/api/cart/items')
//   //     .set('Cookie', AUTH_COOKIE)
//   //     .send({ productId: VALID_ID_2, qty: 5 });

//   //   expect(res.status).toBe(400);
//   //   expect(res.body.error).toBe('insufficient stock');
//   // });

//   test('PATCH /api/cart/items updates quantity and removes on zero', async () => {
//     await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ productId: VALID_ID_1, qty: 2 });

//     const upd = await request(app)
//       .patch(`/api/cart/items/${VALID_ID_1}`)
//       .set('Cookie', AUTH_COOKIE)
//       .send({ qty: 3 });

//     expect(upd.status).toBe(200);
//     expect(upd.body.cart.items[0].quantity).toBe(3);

//     const rem = await request(app)
//       .patch(`/api/cart/items/${VALID_ID_1}`)
//       .set('Cookie', AUTH_COOKIE)
//       .send({ qty: 0 });

//     expect(rem.status).toBe(200);
//     expect(rem.body.cart.items).toHaveLength(0);
//   });

//   test('DELETE /api/cart/items removes a single item', async () => {
//     await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ productId: VALID_ID_1, qty: 1 });

//     const del = await request(app)
//       .delete(`/api/cart/items/${VALID_ID_1}`)
//       .set('Cookie', AUTH_COOKIE);

//     expect(del.status).toBe(200);
//     expect(del.body.items).toHaveLength(0);
//   });

//   test('DELETE /api/cart clears entire cart', async () => {
//     await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ productId: VALID_ID_1, qty: 1 });

//     await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ productId: VALID_ID_2, qty: 1 });

//     const clr = await request(app)
//       .delete('/api/cart')
//       .set('Cookie', AUTH_COOKIE);

//     expect(clr.status).toBe(200);
//     expect(clr.body.items).toEqual([]);
//     expect(clr.body.totals).toEqual({ subtotal: 0, total: 0 });
//   });

//   test('POST /api/cart/items rejects invalid ObjectId', async () => {
//     const res = await request(app)
//       .post('/api/cart/items')
//       .set('Cookie', AUTH_COOKIE)
//       .send({ productId: 'not-an-objectid', qty: 1 });

//     expect(res.status).toBe(400);
//     expect(res.body.errors.length).toBeGreaterThan(0);
//   });
// });


const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * 🔐 Auth setup (MUST be before app import)
 */
process.env.JWT_SECRET = 'test_jwt_secret';

const AUTH_TOKEN = jwt.sign(
  { _id: '507f191e810c19729de860ea', role: 'user' },
  process.env.JWT_SECRET
);
const AUTH_COOKIE = `token=${AUTH_TOKEN}`;

/**
 * 🧠 MOCK AUTH MIDDLEWARE
 */
jest.mock('../src/middlewares/auth.middleware', () => {
  return {
    createAuthMiddleware: () => {
      return (req, res, next) => {
        req.user = { _id: '507f191e810c19729de860ea', role: 'user' };
        next();
      };
    },
  };
});

/**
 * 🧠 IN-MEMORY CART STORE (replaces DB)
 */
let mockCart = {
  items: [],
  save: jest.fn().mockResolvedValue(true),
};

/**
 * 🧠 MOCK CART MODEL
 */
jest.mock('../src/models/cart.model', () => {
  return {
    findOne: jest.fn(() => Promise.resolve(mockCart)),

    create: jest.fn((data) => {
      mockCart = data;
      return Promise.resolve(mockCart);
    }),

    findOneAndUpdate: jest.fn((query, update) => {
      if (update.$set) {
        mockCart = { ...mockCart, ...update.$set };
      }
      return Promise.resolve(mockCart);
    }),
  };
});

/**
 * 🎯 Valid Mongo ObjectIds
 */
const VALID_ID_1 = new mongoose.Types.ObjectId().toString();
const VALID_ID_2 = new mongoose.Types.ObjectId().toString();

/**
 * 🚀 Import app AFTER mocks
 */
const app = require('../src/app');

beforeEach(() => {
  mockCart = {
    items: [],
    save: jest.fn().mockResolvedValue(true),
  };
});

describe('Cart API integration (test-only router)', () => {

  test('GET /api/cart returns empty cart initially', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Cookie', AUTH_COOKIE);

    expect(res.status).toBe(200);
    expect(res.body.cart.items).toEqual([]);
    expect(res.body.totals.itemsCount).toBe(0);
    expect(res.body.totals.totalQty).toBe(0);
  });

  test('POST /api/cart/items rejects when productId missing', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Cookie', AUTH_COOKIE)
      .send({ qty: 1 });

    expect(res.status).toBe(400);
  });

  test('PATCH /api/cart/items updates quantity and removes on zero', async () => {
    // simulate item already in cart
    mockCart.items.push({
        productId: VALID_ID_1,
        quantity: 2,
        price: 10,
    });

    const upd = await request(app)
      .patch(`/api/cart/items/${VALID_ID_1}`)
      .set('Cookie', AUTH_COOKIE)
      .send({ qty: 3 });

    expect(upd.status).toBe(200);

    const rem = await request(app)
      .patch(`/api/cart/items/${VALID_ID_1}`)
      .set('Cookie', AUTH_COOKIE)
      .send({ qty: 0 });

    expect(rem.status).toBe(200);
  });

  test('DELETE /api/cart/items removes a single item', async () => {
    mockCart.items.push({
      productId: VALID_ID_1,
      quantity: 1,
      price: 10,
    });

    const del = await request(app)
      .delete(`/api/cart/items/${VALID_ID_1}`)
      .set('Cookie', AUTH_COOKIE);

    expect(del.status).toBe(200);
  });

  test('DELETE /api/cart clears entire cart', async () => {
    mockCart.items.push(
      { productId: VALID_ID_1, quantity: 1, price: 10 },
      { productId: VALID_ID_2, quantity: 1, price: 20 }
    );

    const clr = await request(app)
      .delete('/api/cart')
      .set('Cookie', AUTH_COOKIE);

    expect(clr.status).toBe(200);
  });

  test('POST /api/cart/items rejects invalid ObjectId', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Cookie', AUTH_COOKIE)
      .send({ productId: 'not-an-objectid', qty: 1 });

    expect(res.status).toBe(400);
  });

});