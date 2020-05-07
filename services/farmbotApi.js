const axios = require("axios"),
    config = require("../config");

let farmbotAPI = axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken
    }
});

module.exports = {
    getSensorReadings: async () => {
        let res = await farmbotAPI.get("/sensor_readings");
        console.log(typeof res);
        
        return res.data;
    },
    getLastSensorReading: async () => {
        //A completer
    }
}

/*module.exports =axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken
    }
});*/
