const express = require('express');
const reportDayController = require('../controllers/reportDayController');
const router = express.Router();

router.post('/', reportDayController.create);
router.get('/:date', reportDayController.read);
module.exports = router;
