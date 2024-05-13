const express =require('express');
const router =express.Router({mergeParams:true});
const {reviewSchema}  = require('../schema.js');
const wrapAsync =require("../utils/wrapasync.js"); 
const ExpressError =require("../utils/ExpressError.js");
const Review =require("../models/review.js");
const Listing=require("../models/listing.js")
const {isLoggedIn, isReviewAuthor} =require("../middleware.js");
const  reviewController=require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg); 
    } else {
        next();
    }
};


//review post route
// bad me add krna hai validateReview
router.post("/",
    isLoggedIn,
    wrapAsync(reviewController.createReview));



//review delete route


router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports= router;
