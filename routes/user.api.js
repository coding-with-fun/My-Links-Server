// For User related stuffs

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

require("colors");
require("dotenv").config();

const router = express.Router();

/**
 * @route           POST /user/signup
 * @description     Register User
 * @access          Private
 */
router.post(
    "/signup",
    [
        check("email", "Email is required.").isEmail(),
        check("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        check("confirmPassword")
            .notEmpty()
            .withMessage("Password is required.")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    response: errors.array(),
                });
            }

            const { email, password, confirmPassword } = req.body;

            // TODO Confirm passwords
            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    response: [
                        {
                            msg: "Passwords do not match.",
                        },
                    ],
                });
            }

            // TODO Check if user exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    response: [
                        {
                            msg: "User with this email address already exists.",
                        },
                    ],
                });
            }

            // TODO Encrypt password
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                email,
                password: hashPassword,
            });

            // * Save user
            await newUser.save();

            // TODO Return JWT
            const payload = {
                user: {
                    id: newUser._id,
                },
            };

            jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
                if (error) throw error;

                return res.status(200).json({
                    status: true,
                    token,
                    success: [
                        {
                            msg: "User created successfully.",
                        },
                    ],
                });
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
    }
);

module.exports = router;
