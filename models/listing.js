const mongoose = require('mongoose');
const Review = require('./review');
const review = require('./review');
const User =require("./user");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename:String,
        // type: String,
        // default: "https://images.unsplash.com/photo-1631528858266-5ebeb8bfc6f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwaG91c2V8ZW58MHx8MHx8fDA%3D",
        // set: (v) => v === "" ? "https://images.unsplash.com/photo-1631528858266-5ebeb8bfc6f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwaG91c2V8ZW58MHx8MHx8fDA%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
],
owner:{
    type: Schema.Types.ObjectId,  //This is the
    ref: 'User',                //user
},
});


listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await Review.deleteMany({_id:{ $in : listing.review}});
};
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
