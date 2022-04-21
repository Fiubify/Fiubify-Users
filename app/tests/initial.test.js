const request = require('supertest');

const app = require('../app');

describe('Example test', () => {
  test('Initial setup', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
