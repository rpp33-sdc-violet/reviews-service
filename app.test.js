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

  it('should respond with text: "success in GET /reviews"', () => {
    expect(response.text).toBe('success in GET /reviews');
  });
});

describe('POST /reviews', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).post('/reviews');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "success in POST /reviews"', () => {
    expect(response.text).toBe('success in POST /reviews');
  });
});

describe('GET /reviews/meta', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get('/reviews/meta');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "success in GET /reviews/meta"', () => {
    expect(response.text).toBe('success in GET /reviews/meta');
  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).put('/reviews/1/helpful');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "success in PUT /reviews/:review_id/helpful"', () => {
    expect(response.text).toBe('success in PUT /reviews/:review_id/helpful');
  });
});

describe('PUT /reviews/:review_id/report', () => {
  let response;

  beforeAll(async () => {
    response = await request(app).put('/reviews/1/report');
  });

  it('should respond with a 200 status code', async () => {
    expect(response.statusCode).toBe(200);
  });

  it('should respond with text: "success in PUT /reviews/:review_id/report"', () => {
    expect(response.text).toBe('success in PUT /reviews/:review_id/report');
  });
});
