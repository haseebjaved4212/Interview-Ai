const mongoose = require("mongoose");


const blacklistSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, " Token Is Required to be added in BlackList"]

    }
},{timestamps:true});