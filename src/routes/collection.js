const express = require('express');
const collectionsController = require('../controllers/collectionsController');
const router = express.Router();

router.get('/customer', collectionsController.customer);
module.exports = router;
