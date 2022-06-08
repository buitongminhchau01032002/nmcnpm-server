const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

router.get('/:id', customerController.readOne);
router.get('/', customerController.read);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.deletee);
module.exports = router;
