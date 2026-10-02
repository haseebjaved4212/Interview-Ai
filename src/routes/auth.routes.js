const { Router } = require("express");
const authRouter = Router();


/**
 * @Post  /api/auth/register
 * @description Register A new User 
 * @access Public 
 */

authRouter.post("/register");
module.exports = authRouter;