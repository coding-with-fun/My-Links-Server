const jwt = require("jsonwebtoken");

require("dotenv").config();
require("colors");

const getUserId = (token, res) => {
    try {
        let userToken = null;

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
