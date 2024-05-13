const User =require("../models/user");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp=async(req,res,next)=>{
    try{
       let {username,email,password}=req.body;
       let newUser=new User({email,username});
       let regUser= await User.register(newUser,password);
       req.login(regUser,(err)=>{
           if(err) return next(err);
           console.log(regUser);
           req.flash("success","WelCome To HeavenHub...");
            res.redirect("/listings");
       });
    }catch(err){
       req.flash("error",err.message);
       res.redirect("/signup");
    }
   };

   module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logIn=async(req,res)=>{
    req.flash("success","WelCome back to  HeavenHub");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logOut=(req, res,next) => {
    req.logout((err)=>{
     if(err) return next(err);
 
    req.flash("success", "Logged you out! See you soon.");
    res.redirect('/listings');
    });
  };