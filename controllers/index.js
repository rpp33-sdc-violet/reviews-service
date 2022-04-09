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
      if (models.reviews.post() === 'reviews data posted') {
        res.send('success in POST /reviews');
      } else {
        res.status(500).send('error in POST /reviews');
      }
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
      if (models.helpful.put() === 'helpful vote inserted') {
        res.send('success in PUT /reviews/:review_id/helpful');
      } else {
        res.status(500).send('error in PUT /reviews/:review_id/helpful');
      }
    },
  },
  report: {
    put: (req, res) => {
      if (models.report.put() === 'reported') {
        res.send('success in PUT /reviews/:review_id/report');
      } else {
        res.status(500).send('error in PUT /reviews/:review_id/report');
      }
    },
  },
};
