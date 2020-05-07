const axios = require("axios"),
    config = require("../config");

module.exports =  axios.create({
    baseURL: "https://api.darksky.net/forecast/" + config.darkskyKey,
    timeout: 2000,
});

/*module.exports = {
    precipIntensity: () => {
        return darkskyAPI
            .get("/83a42c27e8d21e20e138b4691e6aa8d3/42.3601,-71.0589")
            .then(res => {
                var tabPrecip = [];
                for (let i = 0; i < 12; i++) {
                    tabPrecip[i] = res.data.hourly.data[i].precipIntensity;
                }
                return tabPrecip;
            });
    },
    precipIntensityProba: () => {
        return axios
            .get(
                "https://api.darksky.net/forecast/83a42c27e8d21e20e138b4691e6aa8d3/42.3601,-71.0589"
            )
            .then(res => {
                var tabPrecipProba = [];
                for (let i = 0; i < 12; i++) {
                    tabPrecipProba[i] =
                        res.data.hourly.data[i].precipIntensity *
                        res.data.hourly.data[i].precipProbability;
                }
                return tabPrecipProba;
            });
    },
};*/
