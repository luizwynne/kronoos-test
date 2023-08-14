const express = require('express');
const router = express.Router();
const controller = require('../controllers/data.controller')

router.get('/', controller.getData) 

module.exports = router;