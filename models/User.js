const mongoose = require("mongoose"),
    { Schema } = mongoose;

const userSchema = new Schema({
    providerId: String,
    provider: String,
    email: String,
    name: String,
    admin: Boolean
});

module.exports = mongoose.model("User", userSchema);
