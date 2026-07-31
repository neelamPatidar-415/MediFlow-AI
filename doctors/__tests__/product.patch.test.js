const request = require('supertest');

describe('PATCH /api/products/:id (route wiring)', () => {
  let updateMock;
  let app;

  beforeEach(() => {
    jest.resetModules();

    // Mock auth middleware to allow requests
    jest.mock('../src/middlewares/auth.middleware', () => ({
      createAuthMiddleware: () => (req, res, next) => {
        req.user = { id: 'seller123', role: 'seller' };
        next();
      }
    }));

    // Prepare a mutable mock for the controller and assign it to the real module
    updateMock = jest.fn((req, res) => {
      res.status(200).json({ data: { _id: req.params.id, ...req.body } });
    });

    // Instead of providing a jest.mock factory that closes over updateMock
    // (which is disallowed), load the real controller module and replace
    // its `updateProduct` export before requiring the app. The routes will
    // pick up the modified function.
    const controller = require('../src/controllers/product.controller');
    controller.updateProduct = (...args) => updateMock(...args);

    app = require('../src/app');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 and updated product on success', async () => {
    updateMock.mockImplementationOnce((req, res) => {
      res.status(200).json({ data: { _id: req.params.id, title: req.body.title } });
    });

    const res = await request(app)
      .patch('/api/products/507f191e810c19729de860ea')
      .send({ title: 'Updated' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.title).toBe('Updated');
  });

  test('returns 404 when controller responds with not found', async () => {
    updateMock.mockImplementationOnce((req, res) => {
      res.status(404).json({ error: 'Product not found' });
    });

    const res = await request(app).patch('/api/products/507f191e810c19729de860eb').send({ title: 'X' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 when controller responds with invalid id', async () => {
    updateMock.mockImplementationOnce((req, res) => {
      res.status(400).json({ error: 'Invalid product id' });
    });

    const res = await request(app).patch('/api/products/invalid-id').send({ title: 'X' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
