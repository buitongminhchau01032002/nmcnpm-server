const express = require('express');
const collectionsController = require('../controllers/collectionsController');
const router = express.Router();

router.get('/customer', collectionsController.customer);
router.get('/deposit', collectionsController.deposit);
router.get('/reportDay', collectionsController.reportDay);
router.get('/reportMonth', collectionsController.reportMonth);
router.get('/rule', collectionsController.rule);
router.get('/typeSaving', collectionsController.typeSaving);
router.get('/withdraw', collectionsController.withdraw);
module.exports = router;
