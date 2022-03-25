const router = require('express').Router();
const controller = require('../controllers/index');

// Connect controller methods to their corresponding routes
router.get('/', controller.reviews.get);
router.post('/', controller.reviews.post);
router.get('/meta', controller.meta.get);
router.put('/:review_id/helpful', controller.helpful.put);
router.put('/:review_id/report', controller.report.put);

module.exports = router;
