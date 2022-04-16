const models = require('../models/index');
const realPool = require('../database/index');
const testPool = require('../database/index-test');

module.exports = {
  reviews: {
    get: (req, res) => {
      const page = !req.query.page ? 1 : Number(req.query.page);
      const count = !req.query.count ? 5 : Number(req.query.count);
      const { sort } = req.query;
      const productId = req.query.product_id;
      const pool = req.baseUrl === '/reviews_test' ? testPool : realPool;

      models.reviews.get(pool, page, count, sort, productId, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(data);
        }
      });
    },
    post: (req, res) => {
      const pool = req.baseUrl === '/reviews_test' ? testPool : realPool;

      models.reviews.post(pool, req.body, (err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send();
        }
      });
    },
  },
  meta: {
    get: (req, res) => {
      const productId = req.query.product_id;
      const pool = req.baseUrl === '/reviews_test' ? testPool : realPool;

      models.meta.get(pool, productId, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(data);
        }
      });
    },
  },
  helpful: {
    put: (req, res) => {
      const pool = req.baseUrl === '/reviews_test' ? testPool : realPool;

      models.helpful.put(pool, req.params.review_id, (error, noIdFound) => {
        if (error) {
          res.status(500).send(error);
        } else if (noIdFound) {
          res.status(500).send(noIdFound);
        } else {
          res.status(204).send();
        }
      });
    },
  },
  report: {
    put: (req, res) => {
      const pool = req.baseUrl === '/reviews_test' ? testPool : realPool;

      models.report.put(pool, req.params.review_id, (error, noIdFound) => {
        if (error) {
          res.status(500).send(error);
        } else if (noIdFound) {
          res.status(500).send(noIdFound);
        } else {
          res.status(204).send();
        }
      });
    },
  },
};
