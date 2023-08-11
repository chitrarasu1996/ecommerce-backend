require("dotenv").config()
const cors=require("cors");
const express=require("express");
const app=express()



 const db=require("./connect.js/db")
 const authRoutes=require("./routes/auth.routes")
 const categoryRoutes=require("./routes/category.routes")
const productsRoutes=require("./routes/Products.routes")

//middlewars
app.use(express.json());
app.use(cors({
   origin:"https://ecommerce-shop-123.netlify.app/",

}))

app.use("/auth",authRoutes)
app.use("/category",categoryRoutes)
app.use("/product",productsRoutes)
db();
 
const port=process.env.port||8000

 app.get("/",(req,res)=>{
    res.status(200).send("welcome to e-commerce app MERN stack Project")
 })
 app.listen(port,()=>{
    console.log("port is running",port)
 })