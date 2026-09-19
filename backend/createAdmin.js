require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

const {
    MONGO_URI,
    ADMIN_USERNAME,
    ADMIN_PASSWORD
} = process.env;


async function createOrUpdateAdmin() {

    try {

        if (!MONGO_URI || !ADMIN_USERNAME || !ADMIN_PASSWORD) {

            console.log(
                "❌ MONGO_URI, ADMIN_USERNAME and ADMIN_PASSWORD are required in .env"
            );

            return;
        }


        await mongoose.connect(MONGO_URI);

        console.log("✅ MongoDB Connected");


        const hashedPassword =
            await bcrypt.hash(ADMIN_PASSWORD, 10);


        const existingAdmin =
            await Admin.findOne({
                username: ADMIN_USERNAME
            });


        if (existingAdmin) {

            existingAdmin.password = hashedPassword;

            await existingAdmin.save();

            console.log("✅ Existing admin updated");

        } else {

            await Admin.create({
                username: ADMIN_USERNAME,
                password: hashedPassword
            });

            console.log("✅ New admin created");
        }


        console.log("Username:", ADMIN_USERNAME);


    } catch (error) {

        console.log("❌ Error:", error.message);

    } finally {

        try {
            await mongoose.disconnect();
            console.log("🔒 MongoDB connection closed");
        } catch (error) {}

    }

}


createOrUpdateAdmin();