const Image=require("../model/Image");
const {uploadToCloudinary}=require('../helpers/cloudinaryHelpers');
const fs=require('fs');
const { all } = require("../routes/image-routes");
const uploadImage=async(req,res)=>{
    try{
        //check the file is missing
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Image is Missing"
            })
        }
        //upload to cloudinary
        const {url,publicId}=await uploadToCloudinary(req.file.path);

        const newlyUploadedImage=new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId,
        })

        await newlyUploadedImage.save();

        //delete the file from localStorage
        // fs.unlinkSync(req.file.path);

        res.status(201).json({
            success:true,
            message:"Image Uploaded Successfully",
            image:newlyUploadedImage
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}
const fetchAllImage=async(req,res)=>{
    try{
        const allImages=await Image.find({});
        if(allImages){
            return res.status(200).json({
                success:true,
                data:allImages
            })
        }
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went Wrong ! Please Try Again"
        })
    }
}

module.exports={
    uploadImage,
    fetchAllImage,
}