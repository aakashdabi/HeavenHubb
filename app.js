if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const express=require('express');
const app = express();
const mongoose =require("mongoose");
const ejs = require('ejs');
const path = require('path');
const methodOverride =require('method-override');
const ejsMate= require('ejs-mate');
const ExpressError =require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore =require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport')  ;
const LocalStrategy = require('passport-local');
const User  =require("./models/user.js");
const Listing =require("./models/listing.js");

const listingRouter=require( './routes/listing.js');
const  reviewRouter=require('./routes/review.js');
const  userRouter=require('./routes/user.js');
const searchRoute= require('./routes/search.js');
const bookingRouter=require('./routes/booking.js');

// const { reviewSchema } = require('./schema.js');

//const MONGO_URL="mongodb://127.0.0.1:27017/heavenhub";
const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));  
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store =MongoStore.create({
    mongoUrl:dbUrl,
    crypto :{
        secret:"mysecret",
    },
    touchAfter:24*60*60,
});

store.on("error",()=>{
    console.log("error in mongo session store");
});

const sessionOption = { secret: "mysecret",
store,
 resave: false,
 saveUninitialized: true,
cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httOnly:true,
}};
app.get( '/', (req,res) => { 
    res.render("home/home.ejs");
});
//middlewares


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());//intialize passport 
app.use(passport.session()); //to identify browes the person is same on other page no need to relogin
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//session start detail save
passport.deserializeUser(User.deserializeUser());//session end 


app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error =req.flash("error");
    res.locals.currUser= req.user ;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"ak@gmail.com",
//         username:"Akashji",
//     });

//     let newUser=await User.register(fakeUser,"akash");
//     res.send(newUser);
// })


app.use("/search",searchRoute);
app.use("/listings",listingRouter);
app.use("/listings/:id/booking",bookingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// //for any page not found so error will handle by this
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});


// middle ware
app.use((err,req,res,next)=>{
    if (!res.headersSent) {

    let{status=500,message="Some Thing went wrong"}=err;
    res.render("error.ejs",{err})
    // res.status(status).send(message);
    }
});
app.listen(8080,()=>{
    console.log("app is listening")
});