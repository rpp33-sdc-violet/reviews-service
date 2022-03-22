const request = require('supertest');
const app = require('./app');

describe('GET /', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/test');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "testing...testing...1, 2, 3"', () => {
    expect(response.text).toBe('testing...testing...1, 2, 3');
  });
});

describe('GET /reviews', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/reviews');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "testing...testing...1, 2, 3"', () => {
    expect(response.text).toBe('testing...testing...1, 2, 3');
  });
});
