const axios = require("axios"),
    config = require("../config");

let darkskyApi = axios.create({
    baseURL: "https://api.darksky.net/forecast/" + config.darkskyKey,
    timeout: 2000,
});

const toExport = {
    /**
     * Retourne toutes les prévisions de Darksky sous forme d'objet
     */
    getAllForecast: async () => {
        let res = await darkskyApi.get(
            "https://api.darksky.net/forecast/83a42c27e8d21e20e138b4691e6aa8d3/42.3601,-71.0589"
        );

        return res.data;
    },
    /**
     * Retourne un tableau des précipitations sur les douzes prochaines heures (proba*intensité)
     */
    precipIntensityProba: async () => {
        let data = await toExport.getAllForecast();

        var tabPrecipProba = [];
        for (let i = 0; i < 12; i++) {
            tabPrecipProba[i] =
                data.hourly.data[i].precipIntensity *
                data.hourly.data[i].precipProbability;
        }
        return tabPrecipProba;
    },
};

module.exports = toExport;
