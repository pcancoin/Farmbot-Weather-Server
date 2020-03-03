const axios = require("axios"),
    config = require("../config");

module.exports = axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken
    }
});
