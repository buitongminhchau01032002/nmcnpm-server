const express = require('express');
const withdrawController = require('../controllers/withdrawController');
const router = express.Router();

router.post('/', withdrawController.create);
module.exports = router;
