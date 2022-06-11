const express = require('express');
const depositController = require('../controllers/depositController');
const router = express.Router();

router.post('/', depositController.create);
module.exports = router;
