const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
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

/**
 * @desc Logout User 
 * @route GET /api/auth/logout
 * @access Public
 */

async function logoutUserController (req, res){
    try {
        // Extract token from cookie, Authorization header, custom header, or body
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            token = req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
        }

        if (!token && req.headers.token) {
            token = req.headers.token;
        }

        if (!token && req.body?.token) {
            token = req.body.token;
        }

        if (!token) {
            return res.status(400).json({ message: "No token provided. Cannot logout without a token." });
        }

        // Check if token is already blacklisted
        const isBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (!isBlacklisted) {
            await tokenBlacklistModel.create({ token });
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error: error.message });
    }
}

/**
 * @desc Get Logged in user details
 * @route GET /api/auth/get-me
 * @access Private
 */

async function getMeController(req, res) {
    try {
        const userId = req.user._id || req.user.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user details", error: error.message });
    }
}










module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
}