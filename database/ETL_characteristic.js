const fs = require('fs');
const fastcsv = require('fast-csv');
const pool = require('./index');

const csvOptions = { headers: true };

pool.connect((err, client, done) => {
  if (err) throw err;

  // TRACK START OF ETL PROCESS
  console.log('CHARACTERISTICS ETL PROCESS STARTED AT:', new Date().toString());

  const readable = fs.createReadStream('../SDC_data/characteristics.csv')
    .pipe(fastcsv.parse(csvOptions))
    .on('error', (error) => {
      console.log(error);
      process.exit();
    })
    .on('data', (row) => {
      const formatData = [Number(row.id), Number(row.product_id), row.name];
      const query = 'INSERT INTO characteristic (characteristic_id, product_id, category) VALUES ($1, $2, $3)';
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
      console.log('CHARACTERISTICS ETL PROCESS FINISHED AT:', new Date().toString());
      console.log('CHARACTERISTICS ETL PROCESS FINISHED--rowCount:', rowCount);
    });
});
