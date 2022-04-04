// import database here
const pool = require('../database/index');

module.exports = {
  reviews: {
    get: async () => {
      console.log('in models reviews GET');
      // hardcoded parameters - TODO: get FE params
      const page = 1;
      const count = 10;
      const sortNew = 'newest';
      const sortHelp = 'helpful';
      const sortRel = 'relevant';
      const productId = 2;
      const queryText1 = `
        (SELECT json_agg(row_to_json(reviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, body, date, reviewer_name, helpfulness  
          FROM review 
          WHERE product_id=${productId}
        ) AS reviews)`;

      const queryText2 = `
        SELECT json_agg(row_to_json(photos))
        FROM (
          SELECT photo_id, url FROM photo WHERE review_id=${5}
        ) as photos`;

      const queryText3 = `
        SELECT json_agg(row_to_json(reviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, body, date, reviewer_name, helpfulness,
          (SELECT json_agg(photos)
          FROM (
            SELECT photo_id, url FROM photo WHERE review_id=review.review_id
          ) as photos)  
          FROM review 
          WHERE product_id=${productId}
        ) AS reviews`;

      const queryText4 = `
        SELECT json_agg(row_to_json(allReviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness,
            (SELECT array_to_json(array_agg(allPhotos))
              FROM (
                SELECT photo_id AS id, url FROM photo WHERE review_id=review.review_id
              ) allPhotos
            ) AS photos  
          FROM review 
          WHERE product_id=${productId}
        ) AS allReviews`;

      return pool.query(queryText4)
        .then((res) => {
          console.log('HERE:', res.rows[0].json_agg);
          return 'test';
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
