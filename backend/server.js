require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const portfolioRoutes = require("./routes/portfolioRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve main website files
app.use(express.static(path.join(__dirname, "../frontend")));
// API Routes
app.use("/api", orderRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);

// MongoDB
const MONGO_URI = process.env.MONGO_URI;
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.log("❌ MongoDB Connection Failed:");
        console.log(error.message);
    }
}

// MongoDB events
mongoose.connection.on("disconnected", () => {
    console.log("⚠️ Mongoose disconnected");
});

mongoose.connection.on("error", (error) => {
    console.log("🔥 Mongoose error:", error.message);
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Connect MongoDB
connectDB();