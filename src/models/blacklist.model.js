const mongoose = require("mongoose");


const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type: String,
        required: [true, " Token Is Required to be added in BlackList"]

    }
},{timestamps:true});

const tokenBlacklistModel = mongoose.model("tokenBlacklist",blacklistTokenSchema);

module.exports = tokenBlacklistModel;