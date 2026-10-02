const { Router } = require("express");
const authRouter = Router();

const userController = require("../controllers/auth.controller");

/**
 * @Post  /api/auth/register
 * @description Register A new User 
 * @access Public 
 */

authRouter.post("/register", userController.registerUserController);
module.exports = authRouter;