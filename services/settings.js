const Settings = require("../models/Settings"),
    farmbotApi = require("../services/farmbotApi");

const toExport = {
    initSettings: async () => {
        console.log("Initialisation des réglages ...");
        
        try {
            let settings = await Settings.findOne({}, { _id: 0 });
            if (settings === null) {
                
                await Settings.create({
                    toolID: await farmbotApi.getWateringID(),
                    sequenceMountToolID: await farmbotApi.getMountToolID(),
                    sequenceUnmountToolID: await farmbotApi.getUnmountToolID(),
                    valvePin: await farmbotApi.getValvePin(),
                    humidityThreshold: 0.5,
                    waterNeed: 1.071, //mm d'eau pour un radis
                    sensorPin: await farmbotApi.getSensorPin(),
                    lat: 48.1214379,
                    long: -1.635091,
                });
                console.log("Réglages initialisés");
                
            } else {
                console.log("Reglages déjà initialisés");
                
            }

        } catch (err) {
            console.log("Erreur initialisation réglages : ", err);

            throw new Error("Erreur lors de l'initialisation des réglages");
        }
    },
    /**
     * Récupération des réglages
     */
    getSettings: async () => {        
        try {
            let settings = await Settings.findOne({}, { _id: 0 });
            
            return settings;
        } catch (err) {
            console.log("Erreur récupération réglages : ", err);

            throw new Error("Erreur lors de la récupération des réglages");
        }
    },

    setSettings: async reglages => {
        try {
            let nouveauReglages = await Settings.findOneAndUpdate(
                {},
                reglages,
                {
                    fields: { _id: 0 },
                    new: true,
                }
            );
            return nouveauReglages;
        } catch (e) {
            throw new Error("Paramètres incorrects");
        }
    },
};

module.exports = toExport;
