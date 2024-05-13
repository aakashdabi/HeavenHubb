const express =require('express');
const router=express.Router();
const wrapAsync =require("../utils/wrapasync.js"); 
const ExpressError =require("../utils/ExpressError.js");
const {ListingSchema}  = require('../schema.js');
const Listing =require("../models/listing.js");
const {isLoggedIn} =require("../middleware.js");
const {isOwner} =require("../middleware.js");
const ListingControllers=require("../controllers/listings.js");

const multer =require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage: storage});


const validateListing = (req, res, next) => {
    let  {error} = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400, errMsg);
    } else {    
        next(); 
    }
};

//we can also combine multiple request of same path
router.route( '/' )
    .get(wrapAsync(ListingControllers.index))
    .post( 
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(ListingControllers.createListing));


//index route
// router.get("/",wrapAsync(ListingControllers.index));


//new route
router.get("/new",isLoggedIn,ListingControllers.newFormRender);
//show route   
router.get("/:id",wrapAsync(ListingControllers.showListings));


//create route

//validateListing, bad me add krna he validation
// router.post('/', 
// isLoggedIn,
// wrapAsync(ListingControllers.createListing));

//edit route

router.get("/:id/edit",isLoggedIn,
isOwner,
wrapAsync(ListingControllers.rednderEditForm));

//update route
//validateListing, bad me add krna hai
router.put("/:id",isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(ListingControllers.updateListings));

//destroy route
router.delete("/:id",isLoggedIn,
isOwner,
wrapAsync(ListingControllers.destroyListing));
 module.exports = router; 