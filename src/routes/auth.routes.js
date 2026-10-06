const { Router } = require("express");
const authRouter = Router();

const userController = require("../controllers/auth.controller");

/**
 * @Post  /api/auth/register
 * @description Register A new User 
 * @access Public 
 */

authRouter.post("/register", userController.registerUserController);


/**
 * @Post  /api/auth/login
 * @description Login User 
 * @access Public 
 */

authRouter.post("/login", userController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description Logout User 
 * @access Public 
 */

authRouter.get("/logout", authController.logoutUserController);

module.exports = authRouter;    