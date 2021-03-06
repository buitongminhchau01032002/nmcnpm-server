const express = require('express');
const savingController = require('../controllers/savingController');
const router = express.Router();

router.get('/filter', savingController.filter);
router.get('/:id', savingController.readOne);
router.get('/', savingController.read);
router.post('/', savingController.create);
router.put('/:id', savingController.update);
router.delete('/:id', savingController.deletee);
module.exports = router;
