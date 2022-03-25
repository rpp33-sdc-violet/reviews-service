const { Client } = require('pg');
require('dotenv').config();

describe('ETL process', () => {
  let client;
  beforeEach(() => {
    client = new Client({
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
      // idleTimeoutMillis: 30000,
      // connectionTimeoutMillis: 2000,
    });
  });

  it('Has 3347679 rows inserted in characteristic table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM characteristic');
    await client.end();
    expect(res.rows[0].count).toBe('3347679');
  });

  it('Has 3347679 rows inserted in characteristic table', async () => {
    await client.connect();
    const res = await client.query('SELECT * FROM characteristic WHERE characteristic_id=1');
    await client.end();
    console.log('HERE!:', res.rows);
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

  it('Has 2742540 rows inserted in photo table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM photo');
    await client.end();
    expect(res.rows[0].count).toBe('2742540');
  });

  it('Has 19327575 rows inserted in reviews_characteristics table', async () => {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM reviews_characteristics');
    await client.end();
    expect(res.rows[0].count).toBe('19327575');
  });
});
