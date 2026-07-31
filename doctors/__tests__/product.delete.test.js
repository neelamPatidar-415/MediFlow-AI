const request = require('supertest');

describe('DELETE /api/products/:id (seller)', () => {
  let deleteMock;
  let app;

  beforeEach(() => {
    jest.resetModules();

    jest.mock('../src/middlewares/auth.middleware', () => ({
      createAuthMiddleware: () => (req, res, next) => {
        req.user = { id: 'seller123', role: 'seller' };
        next();
      }
    }));

    deleteMock = jest.fn((req, res) => {
      res.status(200).json({ data: { _id: req.params.id } });
    });

    // Assign mock to controller export before loading app so routes pick it up
    const controller = require('../src/controllers/product.controller');
    controller.deleteProduct = (...args) => deleteMock(...args);

    app = require('../src/app');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns 200 on successful delete', async () => {
    deleteMock.mockImplementationOnce((req, res) => res.status(200).json({ data: { _id: req.params.id } }));

    const res = await request(app).delete('/api/products/507f191e810c19729de860ea').send();
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe('507f191e810c19729de860ea');
  });

  test('returns 404 when product not found', async () => {
    deleteMock.mockImplementationOnce((req, res) => res.status(404).json({ error: 'Product not found' }));

    const res = await request(app).delete('/api/products/507f191e810c19729de860eb').send();
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for invalid id', async () => {
    deleteMock.mockImplementationOnce((req, res) => res.status(400).json({ error: 'Invalid product id' }));

    const res = await request(app).delete('/api/products/invalid-id').send();
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
