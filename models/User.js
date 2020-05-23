const mongoose = require("mongoose"),
    { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    admin: Boolean
});

module.exports = mongoose.model("User", userSchema);
