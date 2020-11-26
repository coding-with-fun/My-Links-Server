const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        required: true,
        unique: true,
    },

    about: {
        type: String,
        maxlength: 1000,
    },

    topLinks: [
        {
            name: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            },
        },
    ],

    links: [
        {
            name: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            },
        },
    ],

    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = User = mongoose.model("user", UserSchema);
