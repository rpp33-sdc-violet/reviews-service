const fs = require('fs');
const { Pool } = require('pg');
const fastcsv = require('fast-csv');
require('dotenv').config();

const csvOptions = { headers: true };

// create a new connection to the database
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.connect((err, client, done) => {
  if (err) throw err;

  // TRACK START OF ETL PROCESS
  console.log('REVIEWS_CHARACTERISTICS ETL PROCESS STARTED AT:', new Date().toString());

  const readable = fs.createReadStream('../../RPP33_General/SDC_data/characteristic_reviews.csv')
    .pipe(fastcsv.parse(csvOptions))
    .on('error', (error) => {
      console.log(error);
      process.exit();
    })
    .on('data', (row) => {
      const formatData = [
        Number(row.id),
        Number(row.characteristic_id),
        Number(row.review_id),
        Number(row.value),
      ];
      const query = 'INSERT INTO reviews_characteristics (id, characteristic_id, review_id, value) VALUES ($1, $2, $3, $4)';
      readable.pause();
      client.query(query, formatData, (error, res) => {
        if (error) {
          console.log('ERROR IN INSERT', error);
        } else {
          readable.resume();
          // BELOW CODE USED ONLY FOR TESTING SMALL CSV FILES:
          // console.log('SUCCESS IN INSERT', res);
        }
      });
    })
    .on('end', (rowCount) => {
      done();
      // TRACK COMPLETION OF ETL PROCESS
      console.log('REVIEWS_CHARACTERISTICS ETL PROCESS FINISHED AT:', new Date().toString());
      console.log('REVIEWS_CHARACTERISTICS ETL PROCESS FINISHED--rowCount:', rowCount);
    });
});