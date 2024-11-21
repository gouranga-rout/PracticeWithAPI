const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process on failure
    }
};

// If db.js is run directly, test the connection
if (require.main === module) {
    require("dotenv").config(); // Load .env variables
    connectDB();
}

module.exports = connectDB;

