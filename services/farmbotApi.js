const axios = require("axios"),
    config = require("../config");

let farmbotAPI = axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken,
    },
});

const toExport = {
    /**
     * Renvoit toutes les données du capteur d'humidité
     */
    getSensorReadings: async () => {
        let res = await farmbotAPI.get("/sensor_readings");

        //Garder uniquement les mesures du capteurs d'humidité
        let data = res.data.filter((reading) => reading["pin"] === 59);
        return data;
    },

    /**
     * Renvoit la dernière donnée du capteur d'humidité
     */
    getLastSensorReading: async () => {
        let data = await toExport.getSensorReadings();
        return data[data.length - 1].value;
    },

    /**
     * Renvoit le tableau avec toutes les plantes
     */
    plantArray: async () => {
        let tab = [];
        let res = await farmbotAPI.get("/points");
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].pointer_type == "Plant") {
                tab.push(res.data[i]);
            }
        }
        return tab;
    },

    /**
     * Renvoit le tableau des séquences
     */
    getSequences: async () => {
        let res = await farmbotAPI.get("/sequences");
        console.log(res.data);
        return res.data;
    },

    /**
     * Renvoit la liste des outils
     */
    getTools: async () => {
        let res = await farmbotAPI.get("/tools");
        console.log(res.data);
        return res.data;
    },
};

module.exports = toExport;
