const express =require('express');
const router =express.Router();
const User =require("../models/user");
const review = require('../models/review');
const wrapAsync=require("../utils/wrapasync");
const passport = require('passport');
const {savedRedirectUrl} =require("../middleware.js");
const userController=require("../controllers/users.js");


router.get("/signup",userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login",userController.renderLogInForm);

router.post("/login",savedRedirectUrl,
passport.authenticate("local",{failureRedirect:'/login',
 failureFlash:true}),
userController.logIn);

router.get('/logout', userController.logOut);

module.exports=router;