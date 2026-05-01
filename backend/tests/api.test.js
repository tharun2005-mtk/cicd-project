const request = require('supertest');
const app = require('../src/index');

describe('API Tests', () => {
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/tasks returns array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
  });

  test('POST /api/tasks without title returns 400', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
  });
});
