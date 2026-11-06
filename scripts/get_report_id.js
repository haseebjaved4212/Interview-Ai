require("dotenv").config({ path: require('path').join(__dirname, '..', 'Backend', '.env') });
const mongoose = require("mongoose");
const Report = require("../Backend/src/models/interviewReport.model");

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const reports = await Report.find().sort({ createdAt: -1 }).limit(5);
    console.log('Found reports:', reports.map(r => ({ id: r._id.toString(), score: r.matchScore, user: r.user })));
    await mongoose.disconnect();
}

check().catch(console.error);
