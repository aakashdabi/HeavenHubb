const Review =require("../models/review");
const Listing =require("../models/listing");

module.exports.createReview=async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview =new Review(req.body.review);
    newReview.author=req.user._id,
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log(listing.review);
    console.log(newReview);
    req.flash("success","New Review Created");

    res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview =async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted");

    res.redirect(`/listings/${id}`);
};
