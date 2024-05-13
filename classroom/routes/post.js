const express = require("express");
const router = express.Router();

//index -
router.get("/",(req,res)=>{
    res.send("Get for post ");
});

//show 
router.get("/:id",(req,res)=>{
    res.send("Get for show post");
});

//post 
router.post("/",(req,res)=>{
    res.send("Post for post ");
});

//delete 
router.delete("/",(req,res)=>{
    res.send("delete for post ");
});

module.exports=router;