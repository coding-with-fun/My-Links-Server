const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();
require("colors");

const adminAuth = async (req, res, next) => {
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
                    return res.status(400).json({
                        status: false,
                        error: [
                            {
                                msg: "User does not exist.",
                            },
                        ],
                    });
                }

                if (!existingUser.isAdmin) {
                    return res.status(401).json({
                        status: false,
                        error: [
                            {
                                msg: "User is not authenticated.",
                            },
                        ],
                    });
                }

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

module.exports = adminAuth;
