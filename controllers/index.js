const models = require('../models/index');

module.exports = {
  reviews: {
    get: (req, res) => {
      const page = !req.query.page ? 1 : Number(req.query.page);
      const count = !req.query.count ? 5 : Number(req.query.count);
      const { sort } = req.query;
      const productId = req.query.product_id;

      models.reviews.get(page, count, sort, productId, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(data);
        }
      });
    },
    post: (req, res) => {
      models.reviews.post(req.body, (err) => {
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

      models.meta.get(productId, (err, data) => {
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
      models.helpful.put(req.params.review_id, (error, noIdFound) => {
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
      models.report.put(req.params.review_id, (error, noIdFound) => {
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
