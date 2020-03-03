const axios = require("axios"),
    config = require("../config");

module.exports = axios.create({
    baseURL: "https://api.darksky.net/forecast/" + config.darkskyKey,
    timeout: 2000
});
