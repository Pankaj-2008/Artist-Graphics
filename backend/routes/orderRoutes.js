const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");


// GET ALL ORDERS
router.get(
    "/orders",
    authMiddleware,
    async (req, res) => {
        try {
            const orders = await Order.find().sort({ date: -1 });
            res.json(orders);
        } catch (error) {
            console.error("Get Orders Error:", error);
            res.status(500).json({
                message: error.message
            });
        }
    }
);


// PAYMENT STATUS
router.put(
    "/orders/:id/payment",
    authMiddleware,
    async (req, res) => {

        try {

            const { paymentStatus } = req.body;

            if (
                paymentStatus !== "Paid" &&
                paymentStatus !== "Rejected"
            ) {
                return res.status(400).json({
                    message: "Invalid payment status."
                });
            }

            const updateData = {
                paymentStatus: paymentStatus,
                status: paymentStatus
            };

            const order = await Order.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json({
                message: "Payment status updated successfully",
                order: order
            });

        } catch (error) {

            console.error(
                "Payment Status Error:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    }
);


// COMPLETE ORDER
router.put(
    "/orders/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const order =
                await Order.findByIdAndUpdate(
                    req.params.id,
                    {
                        status: "Completed"
                    },
                    {
                        new: true
                    }
                );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json({
                message: "Status Updated",
                order: order
            });

        } catch (error) {

            console.error(
                "Complete Order Error:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    }
);


// DELETE ORDER
router.delete(
    "/orders/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const order =
                await Order.findByIdAndDelete(
                    req.params.id
                );

            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }

            res.json({
                message: "Order Deleted"
            });

        } catch (error) {

            console.error(
                "Delete Order Error:",
                error
            );

            res.status(500).json({
                message: error.message
            });
        }
    }
);


module.exports = router;