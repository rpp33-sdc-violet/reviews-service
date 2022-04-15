/* eslint-disable-next-line */
import http from 'k6/http';
/* eslint-disable-next-line */
import { sleep, check } from 'k6';
/* eslint-disable-next-line */
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 300,
  duration: '30s',
};

export default () => {
  const getReviewRelevant = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=relevant`);
  check(getReviewRelevant, { 'getReviewRelevant status was 200': (r) => r.status === 200 });

  const getReviewNewest = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=newest`);
  check(getReviewNewest, { 'getReviewNewest status was 200': (r) => r.status === 200 });

  const getReviewHelpful = http.get(`http://localhost:8080/reviews?product_id=${randomIntBetween(900010, 1000011)}&sort=helpful`);
  check(getReviewHelpful, { 'getReviewHelpful status was 200': (r) => r.status === 200 });

  const getMetadata = http.get(`http://localhost:8080/reviews/meta?product_id=${randomIntBetween(900010, 1000011)}`);
  check(getMetadata, { 'getMetadata status was 200': (r) => r.status === 200 });

  const putHelpful = http.put('http://localhost:8080/reviews/5515304/helpful');
  check(putHelpful, { 'putHelpful status was 204': (r) => r.status === 204 });

  const putReport = http.put('http://localhost:8080/reviews/5515304/report');
  check(putReport, { 'putReport status was 204': (r) => r.status === 204 });

  const payload = JSON.stringify({
    product_id: 5,
    rating: 5,
    summary: 'test-sum',
    body: 'body-test body-test body-test body-test body-test body-test body-test body-test',
    recommend: true,
    name: 'test-POST',
    photos: ['url-test', 'url-test'],
    email: 'test@test.com',
    characteristics: {
      215990: 5,
      215991: 5,
      215992: 5,
      215993: 5,
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const postReivew = http.post('http://localhost:8080/reviews', payload, params);
  check(postReivew, { 'postReivew status was 201': (r) => r.status === 201 });

  sleep(1);
};

/* manual teardown
UPDATE review SET helpfulness = 29 WHERE review_id=5515304;
UPDATE review SET reported = false WHERE review_id=5515304;
DELETE FROM review WHERE reviewer_name = 'test-POST';
SELECT setval('review_review_id_seq', (SELECT MAX(review_id) FROM review));
SELECT setval('photo_photo_id_seq', (SELECT MAX(photo_id) FROM photo));
SELECT setval('reviews_characteristics_id_seq', (SELECT MAX(id) FROM reviews_characteristics));
*/
