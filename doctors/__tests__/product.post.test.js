const request = require('supertest');
const app = require('../src/app');

// Provide minimal ImageKit env vars so the ImageKit service doesn't throw
process.env.IMAGEKIT_PUBLIC_KEY = 'test_public';
process.env.IMAGEKIT_PRIVATE_KEY = 'test_private';
process.env.IMAGEKIT_URL_ENDPOINT = 'https://example.com/';

jest.mock('imagekit');
jest.mock('../src/models/product.model');
jest.mock('../src/middlewares/auth.middleware', () => ({
  createAuthMiddleware: () => (req, res, next) => {
    req.user = { id: 'seller123', role: 'seller' };
    next();
  }
}));

const ImageKit = require('imagekit');
const Product = require('../src/models/product.model');


beforeAll(() => {
  ImageKit.mockImplementation(() => {
    return {
      upload: jest.fn().mockResolvedValue({ url: 'https://example.com/image.jpg', thumbnail: 'thumb', fileId: 'file123' })
    };
  });
});

afterAll(() => {
  jest.resetAllMocks();
});

test('POST /api/products creates product without image', async () => {
  Product.create = jest.fn().mockResolvedValue({
  _id: '1',
  title: 'Test',
  description: 'desc',
  price: { amount: 100, currency: 'INR' },
  images: [],
});


  const res = await request(app)
    .post('/api/products/')
    .send({ title: 'Test', description: 'desc', price: 100, currency: 'INR' })
    .set('Accept', 'application/json');

  expect(res.status).toBe(201);
  expect(res.body.data.title).toBe('Test');
});

test('POST /api/products creates product with image', async () => {
  Product.create = jest.fn().mockResolvedValue({
  _id: '2',
  title: 'WithImage',
  description: 'desc',
  price: { amount: 200, currency: 'USD' },
  images: [{ url: 'https://example.com/image.jpg' }],
});


  const res = await request(app)
    .post('/api/products/')
    .field('title', 'WithImage')
    .field('description', 'desc')
    .field('price', '200')
    .field('currency', 'USD')
    // .field('seller', 'seller2')
    .attach('images', Buffer.from('test'), 'test.jpg');

  expect(res.status).toBe(201);
  expect(res.body.data.images).toBeDefined();
  expect(res.body.data.images[0].url).toBe('https://example.com/image.jpg');
});
