const mongoose=require("mongoose");
 const mongo_URL=process.env.mongo_URL
 const db=async()=>{
    try{
        await mongoose.connect(mongo_URL) 
        console.log("db connection established")
    }catch(er){
 console.log("error while connecting db")
 console.log(er)
    }
   
};

module.exports=db