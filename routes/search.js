const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapasync.js');
const searchList = require('../controllers/search.js');

router.get('/', wrapAsync(searchList.search));

module.exports = router;
