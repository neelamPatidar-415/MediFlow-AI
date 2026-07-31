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
  // ensure text index exists for search tests
  await Product.createIndexes();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
});

test('GET /api/products returns all products', async () => {
  await Product.create({
    title: 'Apple',
    description: 'Fresh apple',
    price: { amount: 50, currency: 'INR' },
    seller: new mongoose.Types.ObjectId(),
    stock: 10,
  });

  await Product.create({
    title: 'Banana',
    description: 'Yellow banana',
    price: { amount: 20, currency: 'INR' },
    seller: new mongoose.Types.ObjectId(),
    stock: 5,
  });

  const res = await request(app).get('/api/products/').expect(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.length).toBe(2);
  const titles = res.body.data.map(p => p.title).sort();
  expect(titles).toEqual(['Apple', 'Banana']);
});

test('GET /api/products supports search, price filters and pagination', async () => {
  await Product.create([
    { title: 'Cheap', description: 'cheap item', price: { amount: 10, currency: 'INR' }, seller: new mongoose.Types.ObjectId(), stock: 1 },
    { title: 'Mid', description: 'mid item', price: { amount: 50, currency: 'INR' }, seller: new mongoose.Types.ObjectId(), stock: 2 },
    { title: 'Expensive', description: 'expensive item', price: { amount: 200, currency: 'INR' }, seller: new mongoose.Types.ObjectId(), stock: 3 },
  ]);

  const resPrice = await request(app).get('/api/products').query({ minPrice: 20, maxPrice: 100 }).expect(200);
  expect(resPrice.body.data.every(p => p.price.amount >= 20 && p.price.amount <= 100)).toBe(true);

  const resSearch = await request(app).get('/api/products').query({ search: 'expensive' }).expect(200);
  expect(resSearch.body.data.length).toBe(1);
  expect(resSearch.body.data[0].title).toBe('Expensive');

  const resPage = await request(app).get('/api/products').query({ skip: 1, limit: 1 }).expect(200);
  expect(resPage.body.data.length).toBe(1);
});
