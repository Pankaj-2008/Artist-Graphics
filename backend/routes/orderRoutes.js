const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// SAVE ORDER
// Customer website वरून order submit
// ही route PUBLIC ठेवली आहे
// ==========================================

router.post("/orders", async (req, res) => {

    try {

        const order = new Order(req.body);

        await order.save();

        res.status(201).json({
            message: "Order Saved Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// ==========================================
// GET ALL ORDERS
// फक्त logged-in admin
// ==========================================

router.get(
    "/orders",
    authMiddleware,
    async (req, res) => {

        try {

            const orders =
                await Order.find()
                    .sort({ date: -1 });

            res.json(orders);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==========================================
// UPDATE ORDER STATUS
// फक्त logged-in admin
// ==========================================

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

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==========================================
// DELETE ORDER
// फक्त logged-in admin
// ==========================================

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

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;