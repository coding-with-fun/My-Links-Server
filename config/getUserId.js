const jwt = require("jsonwebtoken");

require("dotenv").config();
require("colors");

const getUserId = (req) => {
    try {
        const token = req.header("x-auth-token");
        let userToken = null;

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

        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: false,
                    error: [
                        {
                            msg: "Token is not valid.",
                        },
                    ],
                });
            }

            userToken = decoded.user;
        });

        return userToken;
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

module.exports = getUserId;
