require("../Backend/node_modules/dotenv").config({ path: require('path').join(__dirname, '..', 'Backend', '.env') });
const mongoose = require("../Backend/node_modules/mongoose");
const User = require("../Backend/src/models/user.model");

async function check() {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findById('6aeca2a596efa79286b86002');
    console.log('User found:', { email: user?.email, username: user?.username });
    await mongoose.disconnect();
}

check().catch(console.error);
