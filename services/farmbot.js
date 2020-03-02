const axios = require("axios"),
    config = require("../config");

module.exports = axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 1000,
    headers: {
        Authorization: config.farmbotToken
    }
});
