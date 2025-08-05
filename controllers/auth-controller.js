const User=require("../model/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
//register controller  
const registerUser=async(req,res)=>{
    try{

        //extract user information from our request body
        const {username,email,password,role}=req.body;

        //check if user is already exists in our database
        const checkExistingUser=await User.findOne({
            $or:[{username},{email}],
        })
        if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message:"User is already exists either with same username or email . Please try with different username or email"
            })

        }
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)
        //create a new user and save in your database
        const newlyCreatedUser=new User({
            username,
            email,
            password:hashedPassword,
            role:role || 'user'
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success:true,
                message:"User registered Successfully"
            });
            console.log("working")
        }
        else{
            res.status(400).json({
                success:false,
                message:"Unable to register User. Please try again!."
            })
        }
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            success:false,
            message:"Something went wrong"
        });
    }
}

//login controller
const loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body;
        //check the user is exists or not in the database
        const user=await User.findOne({username});
        if(!user){
            res.status(400).json({
                success:false,
                message:"Invalid user"
            })
        }

        //password is correct or not
        const checkPassword=await bcrypt.compare(password,user.password);
        if(!checkPassword){
            res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            });
        }

    //access web token 
        const accessWebToken=await jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"30m"
        })

        res.status(200).json({
            success:true,
            message:"Logged in Successfully",
            accessWebToken,
        })
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            success:false,
            message:"Something Went Wrong"
        })
    }
}


const changePassword=async(req,res)=>{
    try{
        
        const userID=req.userInfo.userId;

        const user=await User.findById(userID);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }

        const {oldPassword,newPassword}=req.body;

        //check the password matches
        const passwordMatch=await bcrypt.compare(oldPassword,user.password);
        if(!passwordMatch){
            return res.status(400).json({
                success:false,
                message:"Old password does not match"
            });
        }
        //hash the new Password

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(newPassword,salt);

        //update the password
        user.password=hashedPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password Changed Successfully"
        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong .Please try again"
        })
    }
}
module.exports={
    registerUser,
    loginUser,
    changePassword   
}