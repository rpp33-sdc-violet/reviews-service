module.exports = {
  reviews: {
    get: (pool, page, count, sort, productId, callback) => {
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
    post: (pool, bodyParams, callback) => {
      /* **************************** */
      // HELPER QUERY FUNCTIONS
      /* **************************** */
      const insertPhotos = (photos, reviewId, insertPhotosCB) => {
        // USE: CHECK IF INSERTION IS COMPLETE FOR ALL PHOTOS
        const numToInsert = photos.length;
        let insertComplete = 0;

        const queryPhoto = 'INSERT INTO photo (review_id, url) VALUES ($1, $2) RETURNING photo_id';

        photos.forEach((url) => {
          const photoValues = [reviewId, url];
          pool.query(queryPhoto, photoValues, (errPhoto, resPhoto) => {
            if (errPhoto) {
              callback(errPhoto);
            } else {
              insertComplete += 1;
              // IF ALL INSERTION COMPLETE, THEN INVOKE CB
              if (numToInsert === insertComplete) {
                insertPhotosCB();
              }
            }
          });
        });
      };

      const insertCharacteristics = (charObj, reviewId, insertCharCB) => {
        // USE: CHECK IF INSERTION IS COMPLETE FOR ALL CHARACTERISTICS
        const numToInsert = Object.keys(charObj).length;
        let insertComplete = 0;

        const queryChar = 'INSERT INTO reviews_characteristics (characteristic_id, review_id, value) VALUES ($1, $2, $3) RETURNING id';

        Object.keys(charObj).forEach((charId) => {
          const value = charObj[charId];
          const charValues = [charId, reviewId, value];
          pool.query(queryChar, charValues, (errChar, resChar) => {
            if (errChar) {
              callback(errChar);
            } else {
              insertComplete += 1;
              // IF ALL INSERTION COMPLETE, THEN INVOKE CB
              if (numToInsert === insertComplete) {
                insertCharCB();
              }
            }
          });
        });
      };

      /* **************************** */
      // DEFAULTS
      /* **************************** */
      const summary = bodyParams.summary || '';
      const date = new Date().toISOString();

      /* **************************** */
      // TESTING
      /* **************************** */
      // CHECK REVIEW: SELECT * FROM review WHERE review_id=5774953;
      // REMOVE REVIEW: DELETE FROM review WHERE review_id=5774953;

      const queryReview = 'INSERT INTO review (product_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness, email, reported) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING review_id';

      const values = [
        bodyParams.product_id,
        bodyParams.rating,
        summary,
        bodyParams.recommend,
        null,
        bodyParams.body,
        date,
        bodyParams.name,
        0,
        bodyParams.email,
        false];

      pool.query(queryReview, values, (errReview, resReview) => {
        if (errReview) {
          callback(errReview);
        } else {
          const reviewId = resReview.rows[0].review_id;
          // if the review included photos, add to DB
          if (bodyParams.photos.length > 0) {
            insertPhotos(bodyParams.photos, reviewId, () => {
              insertCharacteristics(bodyParams.characteristics, reviewId, () => {
                callback(null);
              });
            });
          } else {
            insertCharacteristics(bodyParams.characteristics, reviewId, () => {
              callback(null);
            });
          }
        }
      });
    },
  },
  meta: {
    get: (pool, productId, callback) => {
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
    put: (pool, reviewId, callback) => {
      /* **************************** */
      // TESTING
      /* **************************** */
      // reviewId: 30
      // endpoint: /reviews/30/helpful
      // Original helpfulness: 14
      // check result: SELECT helpfulness FROM review WHERE review_id=30;
      // undo testing: UPDATE review SET helpfulness = helpfulness - 1 WHERE review_id=30;
      // error no nonexistent review - /reviews/-1/helpful

      // FRONTEND CONNECTION TESTING
      // review_id: 372722
      // Original helpfulness: 21

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
    put: (pool, reviewId, callback) => {
      /* **************************** */
      // TESTING
      /* **************************** */
      // reviewId: 30
      // endpoint: /reviews/30/report
      // check result: SELECT reported FROM review WHERE review_id=30;
      // undo testing: UPDATE review SET reported = false WHERE review_id=30;
      // error no nonexistent review - /reviews/-1/report

      const queryText = `
        UPDATE review 
        SET reported = true 
        WHERE review_id=${reviewId}
      `;

      pool.query(queryText, (err, res) => {
        if (err) {
          callback(err);
        } else if (res.rowCount === 0) {
          callback(null, 'Review does not exist - could not report this review');
        } else {
          callback(null, null);
        }
      });
    },
  },
};
