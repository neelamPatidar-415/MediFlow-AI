const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Product = require('../src/models/product.model');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await Product.createIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

test('GET /api/products/:id returns product when found', async () => {
  const created = await Product.create({
    title: 'SingleProduct',
    description: 'A single product',
    price: { amount: 99, currency: 'INR' },
    seller: new mongoose.Types.ObjectId(),
    stock: 3,
  });

  const res = await request(app).get(`/api/products/${created._id}`).expect(200);
  expect(res.body.data).toBeDefined();
  expect(res.body.data.title).toBe('SingleProduct');
});

test('GET /api/products/:id returns 404 for non-existing id', async () => {
  const id = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/api/products/${id}`).expect(404);
  expect(res.body.error).toBeDefined();
});

test('GET /api/products/:id returns 400 for invalid id', async () => {
  const res = await request(app).get('/api/products/invalid-id').expect(400);
  expect(res.body.error).toBeDefined();
});
