const express = require("express");

const app = express();

// Middleware To Parse JSON 
app.use(express.json());


// Require All Routes Here 

const authRouter = require("./routes/auth.routes");


//  Using All Routes 
app.use("/api/auth", authRouter);

module.exports = app;