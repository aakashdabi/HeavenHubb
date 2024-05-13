const express = require('express');
const router =express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapasync.js');
const booking=require("../controllers/booking.js");

router.get('/',wrapAsync(booking.bookingForm));
//booking 
router.post('/',wrapAsync(booking.bookingConfirm));
  module.exports=router;