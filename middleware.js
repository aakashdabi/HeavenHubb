 const Listing =require("./models/listing"); 
const review = require("./models/review");
const Review = require("./models/review");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    };
    next();
};

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }else{
        res.locals.redirectUrl="/listings";
    }
    next();
};

module.exports.isOwner =async (req,res,next)=> {
   let {id}=req.params; 
    let list = await Listing.findById(id).catch((err)=>console.log(err));
    if(!req.user._id.equals(list.owner._id)){
        req.flash("error","You don't have permission to Delete or Update");
        console.log('not authorized');
        return res.redirect(`listings/${id}`);
    };
    next(); 
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params; 
    let list = await Review.findById(reviewId).catch((err)=>console.log(err));
    if(!list.author.equals(req.user._id)){
        req.flash("error","You don't have permission to Delete this Review");
        console.log('not authorized');
        return res.redirect(`listings/${id}`);
    };
    next();
}