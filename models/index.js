// import database here
const pool = require('../database/index');

module.exports = {
  reviews: {
    get: () => {
      console.log('in models reviews GET');
      // hardcoded parameters - TODO: get FE params
      const page = 1;

      let offsetPage;
      // page - if 0, change to 1
      if (page === 0) {
        offsetPage = 1;
      } else {
        offsetPage = page;
      }

      const count = 2;
      const limit = count;
      const offset = (offsetPage - 1) * count;
      // conditional sorting
      // helpfulness: helpfulness DESC
      // newest: date DESC
      // relevant: helpfulness DESC, date DESC
      const sort = 'helpfulness DESC, date DESC';
      const productId = 2;

      const queryReviewWithoutPhotosTEST = `
        (SELECT json_agg(row_to_json(reviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, body, date, reviewer_name, helpfulness  
          FROM review 
          WHERE product_id=${productId}
        ) AS reviews)`;

      const queryPhotosTEST = `
        SELECT json_agg(row_to_json(photos))
        FROM (
          SELECT photo_id, url FROM photo WHERE review_id=${5}
        ) as photos`;

      const queryText = `
        SELECT json_build_object(
        'product', ${productId},
        'page', ${page},
        'count', ${count},
        'results', (SELECT json_agg(row_to_json(allReviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, reported,
            (SELECT array_to_json(array_agg(allPhotos))
              FROM (
                SELECT photo_id AS id, url FROM photo WHERE review_id=review.review_id
              ) allPhotos
            ) AS photos  
          FROM review 
          WHERE product_id=${productId} AND reported=false
          ORDER BY ${sort}
          LIMIT ${limit}
          OFFSET ${offset}
        ) AS allReviews))`;

      return pool.query(queryText)
        .then((res) => {
          console.log('GET /reviews:', res.rows[0].json_build_object);
          return res.rows[0].json_build_object;
        })
        .catch((error) => {
          console.log('error in models reviews GET', error);
        });
    },
    post: () => {
      console.log('in models reviews POST');
      return 'reviews data posted';
    },
  },
  meta: {
    get: () => {
      console.log('in models meta GET');
      return 'metadata here';
    },
  },
  helpful: {
    put: () => {
      console.log('in models helpful PUT');
      return 'helpful vote inserted';
    },
  },
  report: {
    put: () => {
      console.log('in models report PUT');
      return 'reported';
    },
  },
};
