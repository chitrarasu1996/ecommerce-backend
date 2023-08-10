const express=require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewars");
const { createCategoryController, updateCategoryController, allCategoryController, singleCategoryController, deleteCategoryController, getSingleProductCategory } = require("../controllers/categoryController");


const router=express.Router();

//create Products

router.post("/create-category",requireSignIn,isAdmin,createCategoryController)

//update category

router.put("/update-catogory/:id",requireSignIn,isAdmin,updateCategoryController)

//get all category

 router.get("/get-category",allCategoryController)

//single category

router.get("/single-category/:slug",singleCategoryController)
//single category by single-product
router.get("/singleproduct-categroy/:id",getSingleProductCategory)

//delete category
router.delete("/delete-catgery/:id",requireSignIn,isAdmin,deleteCategoryController)
module.exports=router
