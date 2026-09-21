const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

const {
    sendAdminOrderEmail
} = require("../emailService");


// =====================================================
// SERVICES AND PRICES
// =====================================================

const SERVICE_PRICES = {
    "Graphic Design": 300,
    "Video Editing": 500,
    "Video Shoot": 1000
};


// =====================================================
// ONLINE UPI PAYMENT REQUEST
// =====================================================

router.post("/payment/online", async (req, res) => {

    try {

        const {
            name,
            phone,
            service,
            details,
            utr,
            paymentScreenshot
        } = req.body;


        // Required fields
        if (!name || !phone || !service || !utr) {

            return res.status(400).json({
                message: "Name, phone, service and UTR are required."
            });

        }


        // Check service
        const amount = SERVICE_PRICES[service];

        if (!amount) {

            return res.status(400).json({
                message: "Invalid service selected."
            });

        }


        // Create order
        const order = new Order({

            name,
            phone,
            service,

            details: details || "",

            paymentMode: "Online",

            paymentStatus: "Payment Verification Pending",

            status: "Pending",

            utr: utr.trim(),

            paymentScreenshot: paymentScreenshot || ""

        });


        // Save order
        await order.save();

        console.log("✅ Online order saved:", order._id);


        // Send email
        try {

            await sendAdminOrderEmail(order);

            console.log("📧 Admin email sent successfully");

        } catch (emailError) {

            console.error(
                "⚠️ Admin email failed:",
                emailError.message
            );

        }


        // Response
        res.status(201).json({

            message:
                "Payment verification request submitted successfully.",

            orderId: order._id,

            amount

        });


    } catch (error) {

        console.error(
            "Online payment request error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to submit payment request."

        });

    }

});



// =====================================================
// OFFLINE / CALL REQUEST
// =====================================================

router.post("/payment/offline", async (req, res) => {

    try {

        const {
            name,
            phone,
            service,
            details
        } = req.body;


        // Required fields
        if (!name || !phone || !service) {

            return res.status(400).json({

                message:
                    "Name, phone and service are required."

            });

        }


        // Check service
        const amount = SERVICE_PRICES[service];

        if (!amount) {

            return res.status(400).json({

                message:
                    "Invalid service selected."

            });

        }


        // Create call request
        const order = new Order({

            name,
            phone,
            service,

            details: details || "",

            paymentMode: "Offline",

            paymentStatus: "Call Requested",

            status: "Call Requested"

        });


        // Save order
        await order.save();

        console.log("✅ Offline order saved:", order._id);


        // Send email
        try {

            await sendAdminOrderEmail(order);

            console.log(
                "📧 Admin email sent successfully"
            );

        } catch (emailError) {

            console.error(
                "⚠️ Admin email failed:",
                emailError.message
            );

        }


        // Response
        res.status(201).json({

            message:
                "Call request submitted successfully.",

            orderId: order._id

        });


    } catch (error) {

        console.error(
            "Offline call request error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to submit call request."

        });

    }

});


module.exports = router;