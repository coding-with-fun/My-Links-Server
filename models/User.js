const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    isAdmin: {
        type: Boolean,
        default: false,
    },

    name: {
        type: String,
        default: "",
    },

    userName: {
        type: String,
        default: "",
    },

    email: {
        type: String,
    },

    password: {
        type: String,
    },

    about: {
        type: String,
        default: "",
        maxlength: 1000,
    },

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
