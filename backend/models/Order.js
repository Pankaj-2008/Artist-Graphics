const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    service: {
        type: String,
        required: true,
        trim: true
    },

    details: {
        type: String,
        default: "",
        trim: true
    },

    // Online / Offline
    paymentMode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true
    },

    // Payment status
    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Payment Verification Pending",
            "Paid",
            "Call Requested",
            "Rejected"
        ],
        default: "Pending"
    },

    // Admin order status
    status: {
        type: String,
        enum: [
            "Pending",
            "Paid",
            "Call Requested",
            "Completed",
            "Rejected"
        ],
        default: "Pending"
    },

    // UPI transaction reference
    utr: {
        type: String,
        default: ""
    },

    // Payment screenshot
    paymentScreenshot: {
        type: String,
        default: ""
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);