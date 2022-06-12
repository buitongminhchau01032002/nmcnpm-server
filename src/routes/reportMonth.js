const express = require('express');
const reportMonthController = require('../controllers/reportMonthController');
const router = express.Router();

router.post('/', reportMonthController.create);
router.get('/:month', reportMonthController.read);
module.exports = router;
