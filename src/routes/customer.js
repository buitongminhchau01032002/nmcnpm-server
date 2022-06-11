const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();

router.get('/filter', customerController.filter);
router.get('/:id', customerController.readOne);
router.get('/find/identity/:identity', customerController.findIdentityNumber);
router.get('/', customerController.read);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.deletee);
module.exports = router;
