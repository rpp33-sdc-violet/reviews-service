const models = require('../models/index');

module.exports = {
  reviews: {
    get: (req, res) => {
      if (models.reviews.get() === 'all reviews data') {
        res.send('success in GET /reviews');
      } else {
        res.status(500).send('error in GET /reviews');
      }
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
      if (models.meta.get() === 'metadata here') {
        res.send('success in GET /reviews/meta');
      } else {
        res.status(500).send('error in GET /reviews/meta');
      }
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
