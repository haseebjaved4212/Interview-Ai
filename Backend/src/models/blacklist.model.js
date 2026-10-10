const mongoose = require("mongoose");


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in BlackList"],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Automatically removed by MongoDB after 24 hours (1 day)
    }
}, { timestamps: true });

const tokenBlacklistModel = mongoose.model("blacklistTokens",blacklistTokenSchema);

module.exports = tokenBlacklistModel;