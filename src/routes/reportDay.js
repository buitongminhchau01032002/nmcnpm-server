const express = require('express');
const reportDayController = require('../controllers/reportDayController');
const router = express.Router();

router.post('/', reportDayController.create);
module.exports = router;
