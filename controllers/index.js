const models = require('../models/index');
const test = require('../models/index-test');

module.exports = {
  reviews: {
    get: (req, res) => {
      const page = !req.query.page ? 1 : Number(req.query.page);
      const count = !req.query.count ? 5 : Number(req.query.count);
      const { sort } = req.query;
      const productId = req.query.product_id;
      if (req.baseUrl === '/reviews_test') {
        test.reviews.get(page, count, sort, productId, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(data);
          }
        });
      } else {
        models.reviews.get(page, count, sort, productId, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(data);
          }
        });
      }
    },
    post: (req, res) => {
      if (req.baseUrl === '/reviews_test') {
        test.reviews.post(req.body, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send();
          }
        });
      } else {
        models.reviews.post(req.body, (err) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(201).send();
          }
        });
      }
    },
  },
  meta: {
    get: (req, res) => {
      const productId = req.query.product_id;

      if (req.baseUrl === '/reviews_test') {
        test.meta.get(productId, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(data);
          }
        });
      } else {
        models.meta.get(productId, (err, data) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(data);
          }
        });
      }
    },
  },
  helpful: {
    put: (req, res) => {
      if (req.baseUrl === '/reviews_test') {
        test.helpful.put(req.params.review_id, (error, noIdFound) => {
          if (error) {
            res.status(500).send(error);
          } else if (noIdFound) {
            res.status(500).send(noIdFound);
          } else {
            res.status(204).send();
          }
        });
      } else {
        models.helpful.put(req.params.review_id, (error, noIdFound) => {
          if (error) {
            res.status(500).send(error);
          } else if (noIdFound) {
            res.status(500).send(noIdFound);
          } else {
            res.status(204).send();
          }
        });
      }
    },
  },
  report: {
    put: (req, res) => {
      if (req.baseUrl === '/reviews_test') {
        test.report.put(req.params.review_id, (error, noIdFound) => {
          if (error) {
            res.status(500).send(error);
          } else if (noIdFound) {
            res.status(500).send(noIdFound);
          } else {
            res.status(204).send();
          }
        });
      } else {
        models.report.put(req.params.review_id, (error, noIdFound) => {
          if (error) {
            res.status(500).send(error);
          } else if (noIdFound) {
            res.status(500).send(noIdFound);
          } else {
            res.status(204).send();
          }
        });
      }
    },
  },
};
