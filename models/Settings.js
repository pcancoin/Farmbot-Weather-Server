const mongoose = require("mongoose"),
    { Schema } = mongoose;

const settingsSchema = new Schema({
    toolID: Number,
    sensorPin: Number,
    valvePin: Number,
    wateringThreshold: Number,
    weatherThreshold: Number,
    lat: Number,
    long: Number
});

module.exports = mongoose.model("Settings", settingsSchema);
