const express = require('express');
const ruleController = require('../controllers/ruleController');
const router = express.Router();

router.get('/:name', ruleController.readOne);
router.get('/', ruleController.read);
router.put('/:name', ruleController.update);
router.put('/', ruleController.updateAll);
module.exports = router;
