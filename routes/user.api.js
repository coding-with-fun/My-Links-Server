// For Links related stuffs

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const userAuth = require("../middleware/userAuth");
const getUserId = require("../config/getUserId");

require("colors");
require("dotenv").config();

const router = express.Router();

/**
 * @route           GET /user/details
 * @description     Get user details
 * @access          Public
 */
router.get("/details", async (req, res) => {
    try {
        let existingUser;
        const { username } = req.query;

        if (username) {
            console.log("I am in username");
            existingUser = await User.findOne(
                { userName: username },
                { password: 0 }
            );
        } else {
            console.log("I am in id");
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

            const { id } = getUserId(token, res);
            existingUser = await User.findById(id, { password: 0 });
        }

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
router.post(
    "/addlink",
    userAuth,
    [
        check("name").notEmpty().withMessage("Link name is required."),
        check("url")
            .notEmpty()
            .withMessage("Link URL is required.")
            .isURL()
            .withMessage("Please enter a valid URL."),
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

            const userID = req.user.id;
            const { name, url } = req.body;
            const options = {
                new: true,
            };

            let newUrl = url;

            if (!url.includes("https://", 0) && !url.includes("http://", 0)) {
                newUrl = "https://" + url;
            }

            const existingUser = await User.findById(userID, { links: 1 });

            existingUser.links.push({
                name,
                url: newUrl,
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
    }
);

/**
 * @route           PATCH /user/updatelink
 * @description     Add new link
 * @access          Private
 */
router.patch(
    "/updatelink",
    userAuth,
    [
        check("linkID").notEmpty().withMessage("Link ID is required."),
        check("name").notEmpty().withMessage("Link name is required."),
        check("url")
            .notEmpty()
            .withMessage("Link URL is required.")
            .isURL()
            .withMessage("Please enter a valid URL."),
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

            const { linkID, name, url } = req.body;

            let newUrl = url;

            if (!url.includes("https://", 0) && !url.includes("http://", 0)) {
                newUrl = "https://" + url;
            }

            const updatedUser = await User.updateOne(
                { "links._id": linkID },
                {
                    $set: {
                        "links.$.name": name,
                        "links.$.url": newUrl,
                    },
                }
            );

            return res.status(200).json({
                status: true,
                userDetails: updatedUser,
                success: [
                    {
                        msg: "Updated link successfully.",
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
    }
);

/**
 * @route           DELETE /user/deletelink
 * @description     Add new link
 * @access          Private
 */
router.delete(
    "/deletelink",
    userAuth,
    [check("linkID").notEmpty().withMessage("Link ID is required.")],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    response: errors.array(),
                });
            }

            const userID = req.user.id;
            const { linkID } = req.body;
            const options = {
                new: true,
            };

            const updatedUser = await User.findByIdAndUpdate(
                userID,
                { $pull: { links: { _id: linkID } } },
                options
            );

            return res.status(200).json({
                status: true,
                userDetails: updatedUser,
                success: [
                    {
                        msg: "Deleted link successfully.",
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
    }
);

module.exports = router;
