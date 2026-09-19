const express = require("express");
const router = express.Router();

const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/authMiddleware");


// ==========================================
// ADD PORTFOLIO
// फक्त logged-in admin
// ==========================================

router.post(
    "/portfolio",
    authMiddleware,
    async (req, res) => {

        try {

            const project =
                new Portfolio(req.body);

            await project.save();

            res.status(201).json({
                message: "Project Added Successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==========================================
// GET ALL PORTFOLIO PROJECTS
// PUBLIC
// Website ला projects दाखवण्यासाठी
// ==========================================

router.get(
    "/portfolio",
    async (req, res) => {

        try {

            const projects =
                await Portfolio.find()
                    .sort({
                        date: -1
                    });

            res.json(projects);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==========================================
// DELETE PORTFOLIO PROJECT
// फक्त logged-in admin
// ==========================================

router.delete(
    "/portfolio/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const project =
                await Portfolio.findByIdAndDelete(
                    req.params.id
                );

            if (!project) {

                return res.status(404).json({
                    message: "Project not found"
                });

            }

            res.json({
                message: "Project Deleted"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;