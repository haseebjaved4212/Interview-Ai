const UserModel = require("../models/user.model");
/**
 * @desc Register A new User 
 * @route Post /api/auth/register
 * @access Public
 */
async function registerUserController (req, res){
   const { username , email , password } = req.body 
   if(!username || !email || !password){
    return res.status(400).json({ message: "Please fill all the fields" });
   }
   
   const isUserAlreadyExists = await UserModel.findOne({$or:[{username},{email}]    });
   if(isUserAlreadyExists){
    return res.status(400).json({ message: "User already exists" });
   }
   
   const user = await UserModel.create({username, email, password});
   res.status(201).json({ message: "User created successfully", user });
}

module.exports = {
    registerUserController,
}