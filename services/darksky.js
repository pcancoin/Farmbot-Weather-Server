const axios = require("axios");

let darkskyApi = axios.create({
    baseURL: "https://api.darksky.net/forecast/" + process.env.darkskyKey,
    timeout: 2000,
});

const toExport = {
    /**
     * Retourne toutes les prévisions de Darksky sous forme d'objet
     */
    getAllForecast: async () => {
        let res = await darkskyApi.get(
            "/48.1214379,-1.635091?lang=fr&units=si"
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
