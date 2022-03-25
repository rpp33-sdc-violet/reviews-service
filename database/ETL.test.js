const { Client } = require('pg');
require('dotenv').config();

jest.useRealTimers();

describe('ETL process', () => {
  let client;
  beforeEach(() => {
    client = new Client({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });
  });

  it('Has 3347679 rows inserted in characteristic table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM characteristic');
    await client.end();
    expect(res.rows[0].count).toBe('3347679');
  });

  it('Inserted data correctly in the characteristic table', async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM characteristic WHERE characteristic_id=1');
    await client.end();
    expect(res.rows[0].characteristic_id).toBe(1);
    expect(res.rows[0].product_id).toBe(1);
    expect(res.rows[0].category).toBe('Fit');
  });

  it('Has 5774952 rows inserted in review table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM review');
    await client.end();
    expect(res.rows[0].count).toBe('5774952');
  });

  it('Inserted data correctly in the review table', async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM review WHERE review_id=1');
    await client.end();
    expect(res.rows[0].review_id).toBe(1);
    expect(res.rows[0].product_id).toBe(1);
    expect(res.rows[0].rating).toBe(5);
    expect(res.rows[0].summary).toBe('This product was great!');
    expect(res.rows[0].recommend).toBe(true);
    expect(res.rows[0].response).toBe(null);
    expect(res.rows[0].body).toBe('I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.');
    expect(res.rows[0].date).toBe('2020-07-30T03:41:21.467Z');
    expect(res.rows[0].reviewer_name).toBe('funtime');
    expect(res.rows[0].helpfulness).toBe(8);
    expect(res.rows[0].email).toBe('first.last@gmail.com');
    expect(res.rows[0].reported).toBe(false);
  });

  it('Has 2742540 rows inserted in photo table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM photo');
    await client.end();
    expect(res.rows[0].count).toBe('2742540');
  });

  it('Inserted data correctly in the photo table', async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM photo WHERE photo_id=1');
    await client.end();
    console.log('HERE!:', res.rows);
    expect(res.rows[0].photo_id).toBe(1);
    expect(res.rows[0].url).toBe('https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');
    expect(res.rows[0].review_id).toBe(5);
  });

  it('Has 19327575 rows inserted in reviews_characteristics table', async () => {
    jest.setTimeout(10000); // increase timer for this test
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM reviews_characteristics');
    await client.end();
    expect(res.rows[0].count).toBe('19327575');
  });

  it('Inserted data correctly in the reviews_characteristics table', async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM reviews_characteristics WHERE id=9');
    await client.end();
    expect(res.rows[0].id).toBe(9);
    expect(res.rows[0].characteristic_id).toBe(5);
    expect(res.rows[0].review_id).toBe(3);
    expect(res.rows[0].value).toBe(4);
  });
});
