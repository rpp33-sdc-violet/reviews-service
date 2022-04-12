const request = require('supertest');
const app = require('./app');
const pool = require('../database/index');

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
  it('should return reviews data based on specific query parameters for product_id: 2', async () => {
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

  it('should sort by helpful', async () => {
    const response = await request(app).get('/reviews?product_id=2&sort=helpful');
    expect(response.body.results[0].review_id).toBe(3);
  });

  it('should sort by newest', async () => {
    const response = await request(app).get('/reviews?product_id=1&sort=newest');
    expect(response.body.results[0].review_id).toBe(2);
  });

  it('should return an empty array when there are NO PHOTOS for a review in product_id: 2', async () => {
    const response = await request(app).get('/reviews?product_id=2&page=2&count=1&sort=relevant');
    expect(response.body.results[0].photos).toEqual([]);
  });

  it('should default to page 1 when no page parameters exists', async () => {
    const response = await request(app).get('/reviews?product_id=2&count=1&sort=relevant');
    expect(response.body.page).toBe(1);
    expect(response.body.results[0].review_id).toBe(5);
  });

  it('should default to page 1 when if page parameter is 0', async () => {
    const response = await request(app).get('/reviews?product_id=2&page=0&count=1&sort=relevant');
    expect(response.body.page).toBe(0);
    expect(response.body.results[0].review_id).toBe(5);
  });

  it('should default to count 5 when if no count parameter exists', async () => {
    const response = await request(app).get('/reviews?product_id=2&page=1&sort=relevant');
    expect(response.body.count).toBe(5);
    expect(response.body.results.length).toBe(5);
  });

  it('should NOT return reported reviews', async () => {
    const response = await request(app).get('/reviews?product_id=7&sort=helpful');
    expect(response.body.results.length).toBe(1);
    expect(response.body.results[0].review_id).toBe(13);
  });

  it('should return an empty array of results if there are NO REVIEWS', async () => {
    const response = await request(app).get('/reviews?product_id=3&sort=helpful');
    expect(response.body.results.length).toBe(0);
    expect(response.body.results).toEqual([]);
  });

  it('should handle errors when missing the product_id parameter', async () => {
    const response = await request(app).get('/reviews');
    expect(response.status).toBe(500);
  });

  it('should handle errors when missing a sort parameter', async () => {
    const response = await request(app).get('/reviews?product_id=1');
    expect(response.status).toBe(500);
  });
});

describe('POST /reviews', () => {
  it('should insert review into review, photo, and reviews_characteristics tables', async () => {
    const beforeInsert = await request(app).get('/reviews?product_id=5&sort=relevant');
    expect(beforeInsert.body.results.length).toBe(2);

    const response = await request(app).post('/reviews').send({
      product_id: 5,
      rating: 5,
      summary: 'test-sum',
      body: 'body-test body-test body-test body-test body-test body-test body-test body-test',
      recommend: true,
      name: 'test-POST',
      photos: [],
      email: 'test@test.com',
      characteristics: {
        215990: 5,
        215991: 5,
        215992: 5,
        215993: 5,
      },
    });
    expect(response.status).toBe(201);

    const afterInsert = await request(app).get('/reviews?product_id=5&sort=relevant');
    expect(afterInsert.body.results.length).toBe(3);

    // RESET DATABASE
    await pool.query('DELETE FROM review WHERE review_id=5774953');
    await pool.query("SELECT setval('review_review_id_seq', (SELECT MAX(review_id) FROM review))");
    await pool.query("SELECT setval('photo_photo_id_seq', (SELECT MAX(photo_id) FROM photo))");
    await pool.query("SELECT setval('reviews_characteristics_id_seq', (SELECT MAX(id) FROM reviews_characteristics))");
  });
});

describe('GET /reviews/meta', () => {
  it('should return correct metadata for product_id: 1', async () => {
    const response = await request(app).get('/reviews/meta?product_id=1');
    expect(response.status).toBe(200);
    expect(response.text).toBe('{"product_id":"1","ratings":{"4":"1","5":"1"},"recommended":{"false":"1","true":"1"},"characteristics":{"Fit":{"id":1,"value":"4.0000000000000000"},"Length":{"id":2,"value":"3.5000000000000000"},"Comfort":{"id":3,"value":"5.0000000000000000"},"Quality":{"id":4,"value":"4.0000000000000000"}}}');
  });

  it('should return correct metadata for product_id: 4', async () => {
    const response = await request(app).get('/reviews/meta?product_id=4');
    expect(response.status).toBe(200);
    expect(response.text).toBe('{"product_id":"4","ratings":{"2":"1","4":"1","5":"1"},"recommended":{"false":"1","true":"2"},"characteristics":{"Fit":{"id":10,"value":"3.6666666666666667"},"Length":{"id":11,"value":"3.6666666666666667"},"Comfort":{"id":12,"value":"3.6666666666666667"},"Quality":{"id":13,"value":"3.6666666666666667"}}}');
  });

  it('should return correct metadata when there are NO REVIEWS for product_id: 3', async () => {
    const response = await request(app).get('/reviews/meta?product_id=3');
    expect(response.status).toBe(200);
    expect(response.body.ratings).toEqual({});
    expect(response.body.recommended).toEqual({});
    expect(response.body.characteristics.Fit.id).toBe(6);
    expect(response.body.characteristics.Fit.value).toBe(null);
    expect(response.body.characteristics.Length.id).toBe(7);
    expect(response.body.characteristics.Length.value).toBe(null);
    expect(response.body.characteristics.Comfort.id).toBe(8);
    expect(response.body.characteristics.Comfort.value).toBe(null);
    expect(response.body.characteristics.Quality.id).toBe(9);
    expect(response.body.characteristics.Quality.value).toBe(null);
  });

  it('should handle errors when missing the product_id parameter', async () => {
    const response = await request(app).get('/reviews/meta');
    expect(response.status).toBe(500);
  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  it('should update helpfulness for review_id: 30', async () => {
    const response = await request(app).put('/reviews/30/helpful');
    expect(response.status).toBe(204);
    const checkUpdate = await request(app).get('/reviews?product_id=14&page=1&count=6&sort=relevant');
    expect(checkUpdate.body.results[3].helpfulness).toBe(15);

    if (checkUpdate.body.results[3].helpfulness === 15) {
      pool.query('UPDATE review SET helpfulness = helpfulness - 1 WHERE review_id=30', (err, res) => {
        if (err) {
          console.log('ERROR UNDOING HELPFULNESS IN TEST', err);
        }
      });
    }
  });

  it('should handle error when review_id does not exist', async () => {
    const response = await request(app).put('/reviews/-1/helpful');
    expect(response.status).toBe(500);
    expect(response.text).toBe('Review does not exist - could not update helpfulness');
  });
});

describe('PUT /reviews/:review_id/report', () => {
  it('should update helpfulness for review_id: 30', async () => {
    const beforeReported = await request(app).get('/reviews?product_id=14&page=1&count=6&sort=relevant');
    expect(beforeReported.body.results.length).toBe(5);

    const response = await request(app).put('/reviews/30/report');
    expect(response.status).toBe(204);

    const afterReported = await request(app).get('/reviews?product_id=14&page=1&count=6&sort=relevant');
    expect(afterReported.body.results.length).toBe(4);
    expect(afterReported.body.results).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          review_id: 30,
        }),
      ]),
    );

    pool.query('UPDATE review SET reported = false WHERE review_id=30', async (err) => {
      if (err) {
        console.log('ERROR UNDOING REPORTED IN TEST', err);
      } else {
        const afterReset = await request(app).get('/reviews?product_id=14&page=1&count=6&sort=relevant');
        expect(afterReset.body.results.length).toBe(5);
      }
    });
  });

  it('should handle error when review_id does not exist', async () => {
    const response = await request(app).put('/reviews/-1/report');
    expect(response.status).toBe(500);
    expect(response.text).toBe('Review does not exist - could not report this review');
  });
});
