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
      const productId = 3;
      // ratings: 2: 1, 4: 1, 5: 1,
      // recommend: false: 1, true: 2
      // characteristics:

      // No metadata:
      // const productId = 3;
      // ratings: {}
      // recommended: {}
      // characteristics: {characteristic_category: {id: #, value: null}}

      const queryRatingsRecommended = `
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
            GROUP BY recommend) AS recommended), '{}')
      )`;

      const queryCharacteristics = `
        SELECT * FROM reviews_characteristics  
        INNER JOIN characteristic
        ON characteristic.product_id = ${productId}  
          AND reviews_characteristics.characteristic_id = characteristic.characteristic_id  
      `;

      const queryCharNone = `
        SELECT json_object_agg(category, json_build_object('id', id, 'value', null)) FROM (SELECT characteristic_id AS id, category 
          FROM characteristic
          WHERE product_id = ${productId}) AS char
      `;

      pool.query(queryRatingsRecommended, (errRatingsRecommended, resRatingsRecommended) => {
        if (errRatingsRecommended) {
          console.log('errRatingsRecommended HERE:', errRatingsRecommended);
          callback(errRatingsRecommended);
        } else {
          console.log('queryRatingsRecommended HERE:', resRatingsRecommended.rows[0].json_build_object);
          const metadata = resRatingsRecommended.rows[0].json_build_object;
          pool.query(queryCharacteristics, (errCharacteristics, resCharacteristics) => {
            if (errCharacteristics) {
              console.log('errCharacteristics HERE:', errCharacteristics);
              callback(errCharacteristics);
            } else {
              console.log('queryCharacteristics HERE:', resCharacteristics.rows[0]);
              if (resCharacteristics.rows.length === 0) {
                pool.query(queryCharNone, (errCharNone, resCharNone) => {
                  if (errCharNone) {
                    console.log('errCharNone HERE:', errCharNone);
                    callback(errCharNone);
                  } else {
                    console.log('resCharNone HERE:', resCharNone.rows[0].json_object_agg);
                    metadata.characteristics = resCharNone.rows[0].json_object_agg;
                    console.log('metadata HERE:', metadata);
                    callback(null, 'test what');
                  }
                });
              }
            }
          });
        }
      });

      // pool.query(queryCharacteristics, (err, res) => {
      //   if (err) {
      //     console.log('HERE ERR1:', err);
      //     callback(err);
      //   } else {
      //     console.log('INVESTIGATIVE QUERIES1:', res.rows);
      //     if (res.rows.length === 0) {
      //       pool.query(queryCharacteristicsNone, (error, response) => {
      //         if (error) {
      //           console.log('HERE ERR2:', error);
      //           callback(error);
      //         } else {
      //           console.log('INVESTIGATIVE QUERIES2:', response.rows[0].json_object_agg);
      //           callback(null, 'test2');
      //         }
      //       });
      //     } else {
      //       callback(null, 'test1');
      //     }
      //     // console.log('QUERYTEXT:', res.rows[0].json_build_object);
      //     // callback(null, 'test');
      //   }
      // });
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
