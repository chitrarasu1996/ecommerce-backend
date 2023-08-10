const express=require("express");
const router=express.Router();
 const {registerController,loginController, testController, isTrue, forgotPasswordController, upadateUserProfile, orderDetailsController, getAllorderDetailsController, updateOrderStatusCOntroller}=require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewars");


//register method post

router.post("/register",registerController);

//login user || post

 router.post("/login",loginController)

 //test

 router.get("/test",requireSignIn, isAdmin, testController)


/// forgot-password

router.post("/forgot-password",forgotPasswordController)

//protected user-Route auth

router.get("/user-auth",requireSignIn, isTrue)

router.get("/admin-auth",requireSignIn,isAdmin, isTrue)

router.put("/update-proflie",requireSignIn,upadateUserProfile)
//get orders
router.get("/orders/details",requireSignIn,orderDetailsController)
//getAllOrders
router.get("/all-orders/details",requireSignIn,isAdmin,getAllorderDetailsController)

//update orderstatus
router.put("/order-status/update/:orderId",requireSignIn,isAdmin,updateOrderStatusCOntroller)
module.exports=router