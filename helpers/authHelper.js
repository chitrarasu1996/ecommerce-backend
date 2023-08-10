const bcrypt=require("bcrypt");

exports.hashedPassword=async(password)=>{
 try{
    const saltingsRounds=10
     const hashedPassword= await bcrypt.hash(password,saltingsRounds)
     return hashedPassword
 }catch(er){
    console.log(er)

 }
};

exports.comparePasword=async(password,hashedPassword)=>{

     return await bcrypt.compare(password,hashedPassword) 
}