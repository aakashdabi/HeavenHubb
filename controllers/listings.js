const Listing =require("../models/listing");
module.exports.index=async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.newFormRender=(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"review",populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing){
       req.flash("error","Cannot find that listing!");
       res.redirect("/listings") ;    
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async (req,res,next)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let newListing=[title,description,image,price,location,country];
    // newListing.Listing=new Listing()
    let url=req.file.path;
    let filename=req.file.filename;
    let newlist=new Listing(req.body.listing);
    newlist.owner =req.user._id;   
    newlist.image={url,filename};
    await newlist.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};


module.exports.rednderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListings=async (req,res)=>{
    let {id}=req.params; 
  
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    console.log(list)  
    if(typeof req.file != "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        list.image={url,filename};
        await list.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let list=await Listing.findByIdAndDelete(id);
    console.log(list);
    req.flash("success"," Listing Deleted");

    res.redirect("/listings");
};