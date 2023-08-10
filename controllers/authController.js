
const userModel = require("../models/user.model")
const { hashedPassword, comparePasword } = require("../helpers/authHelper");
const jwt = require("jsonwebtoken");
const orderDetails=require("../models/OrderSchema")

exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        if (!answer) {
            return res.status(200).send({ message: "Answer is required" })
        }
        if (!name) {
            return res.status(200).send({ message: "Name is required" })
        }
        if (!email) {
            return res.status(200).send({ message: "Email is required" })
        }
        if (!password) {
            return res.status(200).send({ message: "password is required" })
        }
        if (!phone) {
            return res.status(200).send({ message: "phone Number is required" })
        }
        if (!address) {
            return res.status(200).send({ message: "Address is required" })
        }
        //existing users
        const existinguser = await userModel.findOne({ email })

        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: "User already registered please login"
            })
        }
        //register user

        const hashedPass = await hashedPassword(password)
        //save

        const newUser = await new userModel({ name, email, password, phone, address, password: hashedPass, answer })
        await newUser.save().then((user) => {
            res.status(201).send({
                success: true, message: "User Registered Successfully", user
            })
        }).catch(() => {
            res.status(401).send({ message: "error while register" })
        });
    } catch (er) {
        console.log(er)
        res.status(500).send({ message: "internal server error " })
    }

};

//login

exports.loginController = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(200).send({ message: "Invalid  username or password" })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(200).send({ message: " email is not Registered" })
        }

        const comparePass = await comparePasword(password, user.password)
        if (!comparePass) {
            return res.status(200).send({ message: "password is not valid" })
        }

        //token 
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.status(201).send({
            success: true, message: "login Succefully", user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        })


    } catch (er) {
        console.log(er)
        res.status(500).send({ message: "internal server error " })
    }
}
//test controller

exports.testController = (req, res) => {

    res.status(200).send({ message: "prodected routes" })

}
exports.isTrue = (req, res) => {

    res.status(200).send({ ok: true })

}

//forgot-password

exports.forgotPasswordController = async (req, res) => {
    try {
        const { email, newpassword, answer } = req.body
        if (!email) {
            res.status(200).send({ message: "Email is required" })

        } if (!newpassword) {
            res.status(200).send({ message: "Newpassword is required" })

        } if (!answer) {
            res.status(200).send({ message: "answer is required" })

        }

        //check
        const user = await userModel.findOne({ email, answer })
        if (!user) {
            res.status(404).send({
                message: "email or answer not valid",
                success: false,
            })
        }
        const hashedNewPassword = await hashedPassword(newpassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashedNewPassword })

        res.status(201).send({

            message: "password Reset successfully ",
            success: true

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "something went wrong",

            error
        })
    }
}
//update profile

exports.upadateUserProfile = async (req, res) => {
    try {
        const { name, password, phone, address } = req.body;

        const user = await userModel.findById(req.user._id);

        if (password && password.length <6) {
            return res.status(200).send({
                success:false,
                message: " Password should be more than 6 Characters"
            })
        }

        const updatedPass = password ? await hashedPassword(password) : null
        const upadtedProfile = await userModel.findByIdAndUpdate({_id:req.user._id},{
            name: name || user.name,
            address: address || user.address,
            password: updatedPass || user.password,
            phone: phone || user.phone,

        }, { new: true })
        if(!upadtedProfile){
            return res.status(200).send({message:"Error while updating user profile"})
        }
        res.status(201).send({success:true,message:"successfully User Updated",upadtedProfile})
console.log(upadtedProfile,"from backend")
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server error" })
    }
}
//order details 

exports.orderDetailsController=async(req,res)=>{
    try {
     
        const result=await orderDetails.find({
            buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
 
        if(!result){
            return res.status(200).send({success:false,message:"User Not Found"})
        }
        res.status(200).send({message:"successfully Orders retrived",success:true,result})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"error while getting Orders"})
    }
}

//get all Orders
exports.getAllorderDetailsController=async(req,res)=>{
    try {
     
        const result=await orderDetails.find({})
        .populate("products","-photo").populate("buyer","name").sort({cratedAt:"-1"})
 
        if(!result){
            return res.status(200).send({success:false,message:"User Not Found"})
        }
        res.status(200).send({message:"successfully all Orders retrived",success:true,result})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"error while getting Orders"})
    }
}

//update orderStatus

exports.updateOrderStatusCOntroller=async(req,res)=>{
    try {
        const {orderId}=req.params;
        const {status}=req.body;
       
        const updatedOrder=await orderDetails.findByIdAndUpdate(orderId,{$set:{status}},{new:true})

        if(!updatedOrder){
return res.status(200).send({success:false,message:"erroe while Updating orderStatus"})
}
res.status(201).send({success:true,message:"successsfully Order Updated"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"internal Server error"})
    }

}