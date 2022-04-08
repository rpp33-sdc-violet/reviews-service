// import database here
const pool = require('../database/index');

module.exports = {
  reviews: {
    get: (page, count, sort, productId, callback) => {
      const offsetPage = page === 0 ? 1 : page;
      const limit = count;
      const offset = (offsetPage - 1) * count;

      let sortText;
      if (sort === 'newest') {
        sortText = 'date DESC';
      } else if (sort === 'helpful') {
        sortText = 'helpfulness DESC';
      } else if (sort === 'relevant') {
        sortText = 'helpfulness DESC, date DESC';
      }

      const queryText = `
        SELECT json_build_object(
        'product', '${productId}',
        'page', ${page},
        'count', ${count},
        'results', (SELECT json_agg(row_to_json(allReviews)) 
        FROM (
          SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, reported,
            (SELECT array_to_json(COALESCE (array_agg(row_to_json(allPhotos)), '{}'))
              FROM (
                SELECT photo_id AS id, url FROM photo WHERE review_id=review.review_id
              ) allPhotos
            ) AS photos  
          FROM review 
          WHERE product_id=${productId} AND reported=false
          ORDER BY ${sortText}
          LIMIT ${limit}
          OFFSET ${offset}
        ) AS allReviews))`;

      pool.query(queryText, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, res.rows[0].json_build_object);
        }
      });

      /* QUERY INVESTIGATION
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
      */
    },
    post: () => {
      console.log('in models reviews POST');
      return 'reviews data posted';
    },
  },
  meta: {
    get: (callback) => {
      console.log('in models meta GET');
      // hardcode data
      const productId = 2;
      // ratings: 2: 1, 3: 1, 4: 2, 5: 1,
      // recommend: true: 3, false: 2
      // characteristics:

      const queryText = `
        SELECT json_build_object(
        'product_id', '${productId}',
        'ratings', (SELECT json_object_agg(rating, count)
          FROM (SELECT review.rating, COUNT(rating)::text
            FROM review
            WHERE product_id=${productId}
            GROUP BY rating 
            ORDER BY rating) AS ratings)
      )`;

      const queryRatings = `
        SELECT json_object_agg(rating, count)
        FROM (SELECT review.rating, COUNT(rating)::text
          FROM review
          WHERE product_id=${productId}
          GROUP BY rating 
          ORDER BY rating) AS ratings
      `;

      const queryRecommended = `
        SELECT COUNT(recommend)
          FROM review
          WHERE product_id=${productId}
          GROUP
      `;

      pool.query(queryText, (err, res) => {
        if (err) {
          console.log('HERE ERR:', err);
          callback(err);
        } else {
          console.log('HERE:', res.rows[0].json_build_object);
          callback(null, 'test');
        }
      });
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
