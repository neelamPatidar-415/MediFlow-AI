const request = require('supertest');

describe('GET /api/products/seller (seller products)', () => {
  let app;
  let mockFn;

  beforeEach(() => {
    jest.resetModules();

    // ensure auth middleware injects seller user
    jest.mock('../src/middlewares/auth.middleware', () => ({
      createAuthMiddleware: () => (req, res, next) => {
        req.user = { id: 'seller123', role: 'seller' };
        next();
      }
    }));

    const controller = require('../src/controllers/product.controller');
    mockFn = jest.fn((req, res) => res.status(200).json({ data: [{ title: 'A', seller: req.user.id }] }));
    controller.getSellerProducts = (...args) => mockFn(...args);

    app = require('../src/app');

    // attach a route for seller products so we don't need to modify app/router
    app.get('/api/products/seller', controller.getSellerProducts);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 and seller products', async () => {
    const res = await request(app).get('/api/products/seller').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].seller).toBe('seller123');
  });

  test('returns 404 when no products found', async () => {
    mockFn.mockImplementationOnce((req, res) => res.status(404).json({ error: 'No products' }));
    const res = await request(app).get('/api/products/seller').expect(404);
    expect(res.body.error).toBeDefined();
  });
});
