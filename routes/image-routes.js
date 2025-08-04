
const express = require('express');
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require('../middleware/upload-middleware.js');
const {uploadImage,fetchAllImage}= require('../controllers/Image-controller');
const router = express.Router();

//upload a image
router.post("/upload",
     authMiddleware, 
     adminMiddleware, 
     uploadMiddleware.single('image'),
     uploadImage);


//to get all the images
router.get('/fetch',
     authMiddleware,
     fetchAllImage,
)

module.exports = router;