const express = require("express");
const cookieParser = require("cookie-parser");


const app = express();

// Middleware To Parse JSON 
app.use(express.json());
// Middleware To Parse Cookies
app.use(cookieParser());

// Require All Routes Here 

const authRouter = require("./routes/auth.routes");


//  Using All Routes 
app.use("/api/auth", authRouter);

module.exports = app;