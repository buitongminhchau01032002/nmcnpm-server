const express = require('express');
const savingController = require('../controllers/savingController');
const router = express.Router();

router.get('/:id', savingController.readOne);
router.get('/', savingController.read);
router.post('/', savingController.create);
router.delete('/:id', savingController.deletee);
module.exports = router;
