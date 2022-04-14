import http from 'k6/http';
import { sleep, check } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import pool from './database/index';

export const options = {
  vus: 1,
  duration: '1s',
};

export default function () {
  // console.log('random integer:', randomIntBetween(1, 10));
  const getReviewRelevant = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=relevant`);
  check(getReviewRelevant, { 'getReviewRelevant status was 200': (r) => r.status == 200 });

  const getReviewNewest = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=newest`);
  check(getReviewNewest, { 'getReviewNewest status was 200': (r) => r.status == 200 });

  const getReviewHelpful = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=helpful`);
  check(getReviewHelpful, { 'getReviewHelpful status was 200': (r) => r.status == 200 });

  const getMetadata = http.get(`http://localhost:8080/reviews/meta?product_id=${randomIntBetween(900010, 1000011)}`);
  check(getMetadata, { 'getMetadata status was 200': (r) => r.status == 200 });

  const putHelpful = http.put('http://localhost:8080/reviews/30/helpful');
  check(putHelpful, { 'putHelpful status was 204': (r) => r.status == 204 });

  sleep(1);
}

export function teardown() {
  pool.query('UPDATE review SET helpfulness = 14 WHERE review_id=30', (err, res) => {
    if (err) {
      console.log('ERROR UNDOING HELPFULNESS IN TEST', err);
    }
  });
}
