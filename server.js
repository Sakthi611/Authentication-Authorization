require('dotenv').config()
const express=require("express");
const app=express();
const PORT= process.env.port || 5000;
const authRoutes=require("./routes/auth-routes")
const connectDB=require('./database/db');
const homeRoutes=require("./routes/home-routes");
const adminRoutes=require("./routes/admin-routes");
const uploadImageRoutes=require('./routes/image-routes');

connectDB();

//middleware 
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/home/",homeRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/image",uploadImageRoutes);

app.get('/', (req, res) => {
  res.send('Server is working!');
});


app.listen(PORT,()=>{
    console.log(`server is listening to the port ${PORT}`);
})