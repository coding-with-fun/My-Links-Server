// For Links related stuffs

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const userAuth = require("../middleware/userAuth");

require("colors");
require("dotenv").config();

const router = express.Router();

/**
 * @route           GET /user/details
 * @description     Get user details
 * @access          Private
 */
router.get("/details", userAuth, async (req, res) => {
    try {
        const userID = req.user.id;

        const existingUser = await User.findById(userID, { password: 0 });

        return res.status(200).json({
            status: true,
            userDetails: existingUser,
            success: [
                {
                    msg: "Fetched user's details successfully.",
                },
            ],
        });
    } catch (error) {
        console.log(`${error.message}`.magenta);

        return res.status(500).json({
            status: false,
            response: [
                {
                    msg: "Internal server error.",
                },
            ],
        });
    }
});

/**
 * @route           POST /user/addlink
 * @description     Add new link
 * @access          Private
 */
router.post("/addlink", userAuth, async (req, res) => {
    try {
        const userID = req.user.id;
        const { name, url } = req.body;
        const options = {
            new: true,
        };

        const existingUser = await User.findById(userID, { links: 1 });

        existingUser.links.push({
            name,
            url,
        });

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            existingUser,
            options
        );

        return res.status(200).json({
            status: true,
            userDetails: updatedUser,
            success: [
                {
                    msg: "Added link successfully.",
                },
            ],
        });
    } catch (error) {
        console.log(`${error.message}`.magenta);

        return res.status(500).json({
            status: false,
            response: [
                {
                    msg: "Internal server error.",
                },
            ],
        });
    }
});

module.exports = router;
