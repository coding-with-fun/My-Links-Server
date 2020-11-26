const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

require("dotenv").config();
require("colors");

const userAuth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) {
            return res.status(401).json({
                status: false,
                error: [
                    {
                        msg: "No token, authorization denied.",
                    },
                ],
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: false,
                    error: [
                        {
                            msg: "Token is not valid.",
                        },
                    ],
                });
            } else {
                const existingUser = await User.findById(decoded.user.id);

                if (!existingUser) {
                    return res.status(404).json({
                        status: false,
                        error: [
                            {
                                msg: "User does not exist.",
                            },
                        ],
                    });
                }

                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.log(`${error.message}`.red);
        return res.status(500).json({
            status: false,
            error: [
                {
                    msg: "Internal server error!!",
                },
            ],
        });
    }
};

module.exports = userAuth;
