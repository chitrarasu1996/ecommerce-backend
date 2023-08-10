
const express=require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewars");
const { createProductsController, getAllProductsController, getProductController, getPhotoController, deleteProductController, updateProdutController, productsFilterController, productsCount, productsListController, productSearchController, getRelatedProductController, getProductsByCategories, brainTreePaymentController, brainTreeTokenController } = require("../controllers/products.controller");
const formidable=require("express-formidable")
const router=express.Router();

//create products

router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductsController)
//get all products
router.get("/getAllProducts",getAllProductsController)

//get single products
router.get("/get-singleProduct/:slug",getProductController)

//get photo
router.get("/get-Photo/:pid",getPhotoController)

//delete product
router.delete("/deleteProduct/:pid",deleteProductController)

//update product
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProdutController)
//get products by filters
router.post("/filter-product",productsFilterController)
 //product count 

 router.get("/products-count",productsCount)


 //products list perpage
 router.get("/product-list/:page",productsListController)
//products serach 
router.get("/search-products/:keywords",productSearchController)
//related product

router.get("/getrelated-products/:pid/:cid",getRelatedProductController)
//get product by categories
router.get("/product-category/:slug",getProductsByCategories)
//braintree token controller
router.get("/brain-tree/token",brainTreeTokenController)
//brain tree payment

router.post("/braintree/payment",requireSignIn,brainTreePaymentController)


module.exports=router