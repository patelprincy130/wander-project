// if(process.env.NODE_ENV != "production"){
//     require("dotenv").config(); 
// }
const mongoose=require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");
// const dbUrl=process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wander");
}
main()
.then(()=>{
    console.log("connected");
})
.catch(err=>{
    console.log("Error: ",err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67f8097d539487405cc4b93a"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();
