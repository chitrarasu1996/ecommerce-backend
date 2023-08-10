const jwt=require("jsonwebtoken");
const userModel =require("../models/user.model")
exports.requireSignIn=(req,res,next)=>{

    try{
let decode=jwt.verify(req.headers.authorization,process.env.JWT_SECRET_KEY)

req.user=decode


next()

    }catch(er){
console.log(er)

    }
};


exports.isAdmin=async(req,res,next)=>{
    try{
const user=await userModel.findById(req.user._id)
if(!user.role==1){
res.status(401).send({success:false,message:"unAuthorized access"})
}else{
    next()
}
}catch(er){
console.log(er)
    }
}