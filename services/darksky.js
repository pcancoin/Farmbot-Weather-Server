const axios = require("axios"),
    settingsService = require("../services/settings");

let darkskyApi = axios.create({
    baseURL: "https://api.darksky.net/forecast/" + process.env.darkskyKey,
    timeout: 2000,
});

const toExport = {
    /**
     * Retourne toutes les prévisions de Darksky sous forme d'objet
     */
    getAllForecast: async () => {
        let set = await settingsService.getSettings();
        let res = await darkskyApi.get(
            "/"+set.lat+","+set.long+"?lang=fr&units=si"
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
