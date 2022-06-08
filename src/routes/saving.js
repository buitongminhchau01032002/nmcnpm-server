const express = require('express');
const savingController = require('../controllers/savingController');
const router = express.Router();

router.post('/', savingController.create);
router.get('/', savingController.read);
module.exports = router;
