const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
   
   const hash = await bcrypt.hash(password, 10);
   
   const user = await UserModel.create({username, email, password:hash});


   const token = jwt.sign({_id:user._id,username:user.username}, process.env.JWT_SECRET, {expiresIn: "1d"});

   res.cookie("token", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
   })
      
   res.status(201).json({ message: "User created successfully", user:{
      id:user._id,
      username:user.username,
      email:user.email,
   } });

}


/**
 * @desc Login User 
 * @route Post /api/auth/login
 * @access Public
 */
async function loginUserController (req, res){
    const { email , password } = req.body 
    if(!email || !password){
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({_id:user._id,username:user.username}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: false,
    })
    res.status(200).json({ message: "Login successful", user:{  
        id:user._id,
        username:user.username,
        email:user.email,
    } });
}













module.exports = {
    registerUserController,
}