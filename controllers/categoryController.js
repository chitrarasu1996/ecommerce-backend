const CategoryModel = require("../models/Category.model");
 const slugify=require("slugify")
exports.createCategoryController=async(req,res)=>{
try{
const {name}=req.body;
if(!name){
   return res.status(401).send({message:"Name is required"})
}

const existingCategory=await CategoryModel.findOne({name})

if(existingCategory){
    return res.status(200).send({
        success:true,
    message:"user already exisits"})
}
const Newcategory=await new CategoryModel({name,slug:slugify(name)})
await Newcategory.save()
res.status(201).send({success:true,message:"new category was created",Newcategory})

}catch(er){
    console.log(er)
    res.status(500).send({
        success:false,
        message:"Error While Adding Products"
    })
}
};


exports.updateCategoryController=async(req,res)=>{
    try{
        const {name}=req.body
        const {id} =req.params;
const updatedCategory=  await CategoryModel.findByIdAndUpdate(id,{$set:{name,slug:slugify(name)}},{new:true})

res.status(200).send({success:true,message:"successfully category updated",category:updatedCategory})        
    }catch(er){
        console.log(er)
        res.status(500).send({
            success:false,
            message:"Error While updating Products"
        })
    }

};


exports.allCategoryController=async(req,res)=>{

try{
    const allCategory=await CategoryModel.find({})
    res.status(200).send({success:true,message:"All Category List",Category:allCategory})
}catch(er){
    console.log(er)
    res.status(500).send({
        success:false,
        message:"Error While getting All Category"
    })
}

};


exports.singleCategoryController=async(req,res)=>{
try {
    
    const {slug}=req.params;
const singleCatgeory=await CategoryModel.findOne({slug})
res.status(200).send({success:true,message:"successfully category retrived",category:singleCatgeory})
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error While getting single Category"
    })
}

};

exports.deleteCategoryController=async(req,res)=>{
    try {
        const {id}=req.params
await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({message:"category succefully deleted",success:true})
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error While deleting category"
        })
    }
}

//get single category

exports.getSingleProductCategory=async(req,res)=>{
try {
    const {id}=req.params;
  
    const category=await CategoryModel.findById(id)
    res.status(200).send({message:"successfully category retrived",category})
} catch (error) {
    console.log(error)
}
}