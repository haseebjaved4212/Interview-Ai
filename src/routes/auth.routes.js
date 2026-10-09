const { Router } = require("express");
const authRouter = Router();
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

/**
 * @Post  /api/auth/register
 * @description Register A new User 
 * @access Public 
 */

authRouter.post("/register", authController.registerUserController);


/**
 * @Post  /api/auth/login
 * @description Login User 
 * @access Public 
 */

authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout User 
 * @access Public 
 */

authRouter.get("/logout", authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description Get Logged in user details
 * @access Private
 */

authRouter.get("/get-me", authMiddleware, authController.getMeController);


module.exports = authRouter;    