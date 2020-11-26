// For User related stuffs

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

require("colors");
require("dotenv").config();

const router = express.Router();

/**
 * @route           POST /user/signup
 * @description     Register User
 * @access          Private
 */
router.post("/signup", async (req, res) => {
    try {
        return res.send("Success");
    } catch (error) {
        console.log(`${error.message}`.magenta);

        return res.status(500).json({
            status: false,
            error: [
                {
                    msg: "Internal server error...",
                },
            ],
        });
    }
});

module.exports = router;
