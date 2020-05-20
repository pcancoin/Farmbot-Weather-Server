const mongoose = require("mongoose"),
    { Schema } = mongoose;

const tokenSchema = new Schema({
    name: String,
    token: String,
});

module.exports = mongoose.model("Tokens", tokenSchema);
