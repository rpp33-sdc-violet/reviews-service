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
        'results', (SELECT COALESCE(json_agg(row_to_json(allReviews)), '[]') 
        FROM (
          SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, reported,
            (SELECT COALESCE(array_to_json(array_agg(row_to_json(allPhotos))), '[]')
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
        (SELECT COALESCE(json_agg(row_to_json(reviews)), '[]')
        FROM (
          SELECT review_id, rating, summary, recommend, body, date, reviewer_name, helpfulness
          FROM review
          WHERE product_id=${productId}
        ) AS reviews)`;

      const queryPhotosTEST = `
        SELECT COALESCE(json_agg(row_to_json(photos)), '[]')
        FROM (
          SELECT photo_id, url FROM photo WHERE review_id=${4} <-- or 5
        ) as photos`;
      */
    },
    post: () => {
      console.log('in models reviews POST');
      return 'reviews data posted';
    },
  },
  meta: {
    get: (productId, callback) => {
      const queryText = `
        SELECT json_build_object(
        'product_id', '${productId}',
        'ratings', COALESCE((SELECT json_object_agg(rating, count)
          FROM (SELECT review.rating, COUNT(rating)::text
            FROM review
            WHERE product_id=${productId}
            GROUP BY rating 
            ORDER BY rating) AS ratings), '{}'),
        'recommended', COALESCE((SELECT json_object_agg(recommend, count)
          FROM (SELECT review.recommend, COUNT(recommend)::text
            FROM review
            WHERE product_id=${productId}
            GROUP BY recommend) AS recommended), '{}'),
        'characteristics', COALESCE((SELECT json_object_agg(category, json_build_object('id', max, 'value', avg)) 
          FROM (SELECT MAX(characteristic_id), category, AVG(value)::text
            FROM (SELECT characteristic.characteristic_id, category, value
              FROM reviews_characteristics  
              INNER JOIN characteristic
              ON characteristic.product_id = ${productId}  
                AND reviews_characteristics.characteristic_id = characteristic.characteristic_id) AS categoryAverages
              GROUP BY category
              ORDER BY max) AS productChar),
          (SELECT json_object_agg(category, json_build_object('id', id, 'value', null))    
            FROM (SELECT characteristic_id AS id, category 
              FROM characteristic
              WHERE product_id = ${productId}) AS char))
        )`;

      pool.query(queryText, (errRatingsRecommended, resRatingsRecommended) => {
        if (errRatingsRecommended) {
          callback(errRatingsRecommended);
        } else {
          callback(null, resRatingsRecommended.rows[0].json_build_object);
        }
      });

      /* QUERY INVESTIGATION
      HARDCODED DATA: <-- USE THIS FOR TESTING
        const productId = 4;
        ratings: 2: 1, 4: 1, 5: 1,
        recommend: false: 1, true: 2
        characteristics: Fit(10), Length(11), Comfort(12), Quality(13) => 3.66667 avg

        const productId = 1;
        ratings: 4: 1, 5: 1,
        recommend: false: 1, true: 1
        characteristics: Fit(1): 4, Length(2): 3.5, Comfort(3): 5, Quality(4): 4

        NO METADATA:
        const productId = 3;
        ratings: {}
        recommended: {}
        characteristics: {characteristic_category: {id: #, value: null}}

      const queryCharacteristics = `
        SELECT json_object_agg(category, json_build_object('id', max, 'value', avg)) FROM
        (SELECT MAX(characteristic_id), category, AVG(value)::text
        FROM (SELECT characteristic.characteristic_id, category, value
          FROM reviews_characteristics
          INNER JOIN characteristic
          ON characteristic.product_id = ${productId}
            AND reviews_characteristics.characteristic_id = characteristic.characteristic_id)
              AS categoryAverages
          GROUP BY category
          ORDER BY max) AS productChar
      `;

      const queryCharNone = `
        SELECT json_object_agg(category, json_build_object('id', id, 'value', null))
        FROM (SELECT characteristic_id AS id, category
          FROM characteristic
          WHERE product_id = ${productId}) AS char
      `;

      const queryCharacteristicsNEXT = `
        SELECT
        COALESCE((SELECT json_object_agg(category, json_build_object('id', max, 'value', avg))
          FROM (SELECT MAX(characteristic_id), category, AVG(value)::text
            FROM (SELECT characteristic.characteristic_id, category, value
              FROM reviews_characteristics
              INNER JOIN characteristic
              ON characteristic.product_id = ${productId}
                AND reviews_characteristics.characteristic_id = characteristic.characteristic_id)
                  AS categoryAverages
              GROUP BY category
              ORDER BY max) AS productChar),
        (SELECT json_object_agg(category, json_build_object('id', id, 'value', null))
          FROM (SELECT characteristic_id AS id, category
            FROM characteristic
            WHERE product_id = ${productId}) AS char))
      `;
      */
    },
  },
  helpful: {
    put: (reviewId, callback) => {
      // reviewId: 30
      // endpoint: /reviews/30/helpful
      // helpfulness: 14
      // check result: SELECT helpfulness FROM review WHERE review_id=30;
      // undo testing: UPDATE review SET helpfulness = helpfulness - 1 WHERE review_id=30;
      // error no nonexistent review - /reviews/-1/helpful

      const queryText = `
        UPDATE review 
        SET helpfulness = helpfulness + 1 
        WHERE review_id=${reviewId}
      `;

      pool.query(queryText, (err, res) => {
        if (err) {
          callback(err);
        } else if (res.rowCount === 0) {
          callback(null, 'Review does not exist - could not update helpfulness');
        } else {
          callback(null, null);
        }
      });
    },
  },
  report: {
    put: () => {
      console.log('in models report PUT');
      return 'reported';
    },
  },
};
