const Settings = require("../models/Settings");

const toExport = {
    getSettings: async () => {
        try {
            let settings = await Settings.findOne({}, { _id: 0 });
            return settings;
        } catch (err) {
            console.log("Erreur récupération réglages : ", err);

            throw new Error("Erreur lors de la récupération des réglages");
        }
    },

    setSettings: async (reglages) => {
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
