const Listing=require("../models/listing");

module.exports.search=async (req, res) => {
    const searchTerm = req.query.search; // Get search query from URL query string
    // Perform search operation based on searchTerm
    const listing = await Listing.find({ title: { $regex: searchTerm, $options: 'i' } })
    .populate({path:"review",populate:{
        path:"author",
    },
}).populate("owner"); 
    if(!listing[0]){
       req.flash("error","Cannot find that listing!");
       res.redirect("/listings") ;    
    }
    console.log(listing);
    res.render("listings/searchList.ejs",{listing:listing});
}