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
  it('should return reviews data based on specific query parameters', async () => {
    const response = await request(app).get('/reviews?product_id=2&page=1&count=1&sort=relevant');
    expect(response.status).toEqual(200);
    expect(response.body.product).toEqual('2');
    expect(response.body.page).toEqual(1);
    expect(response.body.count).toEqual(1);
    expect(response.body.results[0].review_id).toEqual(5);
    expect(response.body.results[0].rating).toEqual(3);
    expect(response.body.results[0].summary).toEqual("I'm enjoying wearing these shades");
    expect(response.body.results[0].recommend).toEqual(true);
    expect(response.body.results[0].response).toEqual(null);
    expect(response.body.results[0].body).toEqual('Comfortable and practical.');
    expect(response.body.results[0].date).toEqual('2021-03-17T13:28:37.620Z');
    expect(response.body.results[0].reviewer_name).toEqual('shortandsweeet');
    expect(response.body.results[0].helpfulness).toEqual(5);
    expect(response.body.results[0].reported).toEqual(false);
    expect(response.body.results[0].photos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80',
        }),
        expect.objectContaining({
          id: 2,
          url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80',
        }),
        expect.objectContaining({
          id: 3,
          url: 'https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
        }),
      ]),
    );
  });
  // test for photos null to be an empty array
  // test for page 0 (default to 1)
  // test for count/page defaults
  // test that reported reviews doesn't show up
  // test for errors
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
  it('should return correct metadata for product_id: 4', async () => {
    const response = await request(app).get('/reviews/meta?product_id=4');

    expect(response.text).toBe('{"product_id":"4","ratings":{"2":"1","4":"1","5":"1"},"recommended":{"false":"1","true":"2"},"characteristics":{"Fit":{"id":10,"value":"3.6666666666666667"},"Length":{"id":11,"value":"3.6666666666666667"},"Comfort":{"id":12,"value":"3.6666666666666667"},"Quality":{"id":13,"value":"3.6666666666666667"}}}');
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
