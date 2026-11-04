const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    try {
        // Extract token from cookie or Authorization header
        let token = req.cookies?.token;

        if (!token && req.headers.authorization) {
            token = req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
        }

        if (!token) {
            return res.status(401).json({
                message: "Token not provided."
            });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        });

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "token is invalid"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        // Normalize both id and _id so all controllers function reliably
        req.user.id = decoded.id || decoded._id;
        req.user._id = decoded._id || decoded.id;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }
}

module.exports = { authUser };
