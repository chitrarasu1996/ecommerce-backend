const fs = require("fs")
const productModel = require("../models/product.model")
const { default: slugify } = require("slugify");
const { send } = require("process");
const categoryModel=require("../models/Category.model");
const  braintree = require("braintree")
const orderModel=require("../models/OrderSchema")

const  gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId:process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,

});

exports.createProductsController = async (req, res) => {
    try {

        const { name, slug, price, description, category, quantity, shipping } = req.fields

        const { photo } = req.files

     
        switch (true) {
            case !name:
                return res.status(200).send({ message: "name is Required" })
            case !price:
                return res.status(200).send({ message: "price is Required" })
            case !description:
                return res.status(200).send({ message: "Description is Required" })
            case !category:
                return res.status(200).send({message:"Category is Required"})
            case !quantity:
                return res.status(200).send({message:"Quantity is Required"})
           
             case ! photo :
                return res.status(200).send({message:"photo is required and should be less than 1mb"})
            }

            
     
            const products=  new productModel({...req.fields,slug:slugify(name)})

            if(photo){
        products.photo.data=fs.readFileSync(photo.path)
        products.photo.contentType=photo.type
    }
    await products.save()
    
    res.status(201).send({message:"product created succefully ",success:true,product:products})
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Internal Error" })
    }

};

exports.getAllProductsController=async(req,res)=>{
    try {
        const products=await productModel.find({}).select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            totalCount:products.length,
            message:"succefully all products retrived",
            products
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "error while getting products" })
    }  
};

exports.getProductController=async(req,res)=>{
try {

    const {slug}=req.params;

    const product=await productModel.findOne({slug}).select("-photo")

if(!product){
    return res.status(200).send({success:false,message:"No product availabe"})
}
res.status(200).send({success:true,message:"products has successfully retrived",product})

} catch (error) {
    console.log(error)
        res.status(500).send({ 
            success: false, 
            message: "error while getting product" })
}
};
exports.getPhotoController=async(req,res)=>{
    try {
        const {pid}=req.params;
        const product=await productModel.findById(pid).select("photo");
        if(product.photo.data){
            
            res.set("Content-Type",product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
   
        
    } catch (error) {
        console.log(error)
        res.status(500).send({ 
            success: false, 
            message: "error while getting photo" })
    }
};


exports.deleteProductController=async(req,res)=>{
    try {
        
        const {pid}=req.params
        await productModel.findByIdAndDelete(pid).select("-photo")

        res.status(200).send({success:true,message:"product succefully deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).send({ 
            success: false, 
            message: "error while deleting product" })
        }
};

exports.updateProdutController=async(req,res)=>{
    try {

        const { name, slug, price, description, category, quantity, shipping } = req.fields

        const { photo } = req.files

        const {pid}=req.params
     
       
     
        switch (true) {
            case !name:
                return res.status(200).send({ message: "name is Required" })
            case !price:
                return res.status(200).send({ message: "price is Required" })
            case !description:
                return res.status(200).send({ message: "Description is Required" })
            case !category:
                return res.status(200).send({message:"Category is Required"})
            case !quantity:
                return res.status(200).send({message:"Quantity is Required"})
           
             case ! photo :
                return res.status(200).send({message:"photo is required and should be less than 1mb"})
            }


            
     
            const products=  await productModel.findByIdAndUpdate(pid,{...req.fields,slug:slugify(name)},{new:true})
            if(photo){
        products.photo.data=fs.readFileSync(photo.path)
        products.photo.contentType=photo.type
    }
    await products.save()
    
    res.status(201).send({message:"product updated succefully ",success:true,product:products})
    
} catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "error while updating product" })
    }
    }
// products filter

exports.productsFilterController=async(req,res)=>{
try {

    const {checked,radio}=req.body

    let allArgument={};

    if(checked){
        allArgument.category=checked;
    }

  
    if(radio.length){
allArgument.price={$gte:radio[0],$lte:radio[1]}
    }
const products=await productModel.find(allArgument)
if(products.length){
    res.status(201).send({success:true,message:"succefully retrived",products})
}else{
    res.status(200).send({success:false,message:"No Products Are availabe",products})
}

}catch(er){
console.log(er)
res.status(500).send({success:false,
    message:"Error while Filtering the Products"})
}
   
}

//products count 

exports.productsCount=async(req,res)=>{
try {
    const totalProducts=await productModel.find({}).estimatedDocumentCount();

    if(totalProducts){
       return res.status(200).send({message:"succssfully all products count retrived",totalProducts})
    }else{
       return res.status(200).send({message:"error while counting products"})
    }

} catch (error) {
    console.log(error)
    res.status(500).send({message:"Internal server error"})
}
}

//productsListController

exports.productsListController=async(req,res)=>{

    try {
        
        const perPage=6;

      const page=req.params.page;



       const products=await productModel.find({}).select("-photo").skip((page-1)*(perPage)).limit(6).sort({createdAt:-1})

    return res.status(200).send({success:true,products})

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Internal server error"})
    }
}

//products search 

exports.productSearchController=async(req,res)=>{
    try {
        const {keywords}=req.params;

        const result=await productModel.find({
            $or:[
              {name:{$regex:keywords,$options:"i"}},
              {description:{$regex:keywords,$options:"i"}}
            ]
        }).select("-photo")
        
        res.status(200).send({success:true,result})
    } catch (error) {
        console.log(error)
res.status(500).send({message:"internal server error "})
    }
}
/// get related products

exports.getRelatedProductController=async(req,res)=>{

    try {
        const {pid,cid}=req.params
       
        const product=await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).limit(3).select("-photo").populate("category")

        res.status(200).send({success:true,
            message:"succeffully retrived simiral products",
        product})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"internel server Error"})
    }
}

//get prodcuts by categories
exports.getProductsByCategories=async(req,res)=>{
try {
    const categories=await categoryModel.findOne({slug:req.params.slug})
  
    const products=await productModel.find({category:categories._id}).select("-photo").populate("category")
res.status(200).send({success:true,products,categories})
} catch (error) {
    console.log(error)
}
};

//brain tree token
exports.brainTreeTokenController=async(req,res)=>{
    try {
        
       await gateway.clientToken.generate({},function(err,response){
            if(err){
res.status(500).send(err)
            }else{
                res.status(200).send(response)
            }
        })
    } catch (error) {
        console.log(error);

    }
};
//payment controller

exports.brainTreePaymentController=async(req,res)=>{
    try {

        const{cart,nonce}=req.body;
        console.log(cart)
      
        let total=0;
        cart.map((p)=>{
total+=p.price
        });

        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },(err,result)=>{
            if(result){
                const order=new orderModel({
                    buyer:req.user._id,
                    products:cart,
                    payment:result,
                
            }).save()

            res.json({ok:true})

            }else{
                return res.status(500).send(err)
            }
        })
    } catch (error) {
        console.log(error)
    }
}