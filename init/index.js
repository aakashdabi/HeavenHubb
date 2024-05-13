if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const mongoose=require("mongoose");
let initData =require("./data.js");

const Listing =require("../models/listing.js");

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};
 
const initDB =async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj ,owner:"6638904b16a1ddbd648b041a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();