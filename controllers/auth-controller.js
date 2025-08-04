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


module.exports={
    registerUser,
    loginUser,
    
}