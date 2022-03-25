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
  console.log('REVIEWS ETL PROCESS STARTED AT:', new Date().toString());

  // ETL PROCESS
  const readable = fs.createReadStream('../SDC_data/reviews.csv')
    .pipe(fastcsv.parse(csvOptions))
    .on('error', (error) => {
      console.log(error);
      process.exit();
    })
    .on('data', (row) => {
      const recommendBoolean = row.recommend === 'true';
      const response = row.response === 'null' ? null : row.response;
      const date = new Date(Number(row.date)).toISOString();
      const reportedBoolean = row.reported === 'true';
      const formatData = [
        Number(row.id),
        Number(row.product_id),
        Number(row.rating),
        row.summary,
        recommendBoolean,
        response,
        row.body,
        date,
        row.reviewer_name,
        Number(row.helpfulness),
        row.reviewer_email,
        reportedBoolean,
      ];
      const query = 'INSERT INTO review (review_id, product_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, email, reported) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
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
      console.log('REVIEWS ETL PROCESS FINISHED AT:', new Date().toString());
      console.log('REVIEWS ETL PROCESS FINISHED--rowCount:', rowCount);
    });
});
