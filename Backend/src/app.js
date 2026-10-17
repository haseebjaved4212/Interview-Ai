const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();

// Middleware To Parse JSON 
app.use(express.json());
// Middleware To Parse Cookies
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Require All Routes Here 

const authRouter = require("./routes/auth.routes");


//  Using All Routes 
app.use("/api/auth", authRouter);

module.exports = app;