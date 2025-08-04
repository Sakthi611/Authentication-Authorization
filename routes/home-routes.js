const express=require("express");
const authMiddleware=require('../middleware/auth-middleware')

const router=express.Router();

router.get("/welcome",authMiddleware,(req,res)=>{
    const {userId,username,role}=req.userInfo;

    res.status(200).json({
        message:"Welcome to the Home page",
        user:{
            _id:userId,
            name:username,
            role:role
        }
    })
})

module.exports=router;