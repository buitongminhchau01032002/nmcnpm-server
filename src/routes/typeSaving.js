const express = require('express');
const typeSavingController = require('../controllers/typeSavingController');
const router = express.Router();

router.get('/:id', typeSavingController.readOne);
router.get('/', typeSavingController.read);
router.post('/', typeSavingController.create);
router.put('/:id', typeSavingController.update);
router.delete('/:id', typeSavingController.deletee);
module.exports = router;
