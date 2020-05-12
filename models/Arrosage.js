const mongoose = require("mongoose"),
    { Schema } = mongoose;

const arrosageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    humidite: Number,
    indicateurMeteo: Number,
});

module.exports = mongoose.model("Arrosage", arrosageSchema);
