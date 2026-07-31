const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    }catch(err){
        console.error("database connection failed",err);
    }
}

module.exports = connectDB;