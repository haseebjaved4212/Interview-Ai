const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
   username:{
    type: String,
    required: [true, "username is required"],
    unique: [true, "username is already taken"]
   },
   email:{
    type: String,
    required: [true, "email is required"],
    unique: [true, "Account already exists with This Email adress"]
   },
   password:{
    type: String,
    required: [true, "password is required"]
   }
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;