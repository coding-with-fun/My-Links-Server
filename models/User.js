const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false,
    },

    name: {
        type: String,
    },

    userName: {
        type: String,
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    },

    about: {
        type: String,
        maxlength: 1000,
    },

    topLinks: [
        {
            name: {
                type: String,
            },

            url: {
                type: String,
            },
        },
    ],

    links: [
        {
            name: {
                type: String,
            },

            url: {
                type: String,
            },
        },
    ],

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = User = mongoose.model("user", UserSchema);
