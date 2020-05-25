const Arrosage = require("../models/Arrosage");

const toExport = {
    /**
     * Renvoie les derniers arrosages effectués
     * @param {nombre d'arrosages à renvoyer} limit
     */
    getArrosages: async (limit = 3) => {
        try {
            let arrosages = await Arrosage.find({}, { _id: 0 }).sort({date : -1}).limit(limit);
            return arrosages;
        } catch (err) {
            console.log("Erreur récupération arrosages : ", err);

            throw new Error("Erreur lors de la récupération des arrosages");
        }
    },
    /**
     * Crée et renvoie un nouvel arrosage à partir d'un objet arrosage
     * @param {paramètres de l'arrosage à créer} arrosage 
     */
    createArrosage: async (arrosage) => {
        try {
            let nouvelArrosage = await Arrosage.create(
                arrosage
            );
            return nouvelArrosage;
        } catch (e) {
            throw new Error("Paramètres incorrects");
        }
    },
    /**
     * Crée un arrosage avec des valeurs aléatoires d'humidité et d'indicateur météo (utile pour les tests)
     */
    launchArrosage: async () => {
        randArrosage = {
            humidite: Math.floor((Math.random() * 100) + 1),
            indicateurMeteo: Math.random().toFixed(2),
        }
        try {
            toExport.createArrosage(randArrosage);
        } catch (error) {
            console.log(error);
            
            console.error("Erreur lors du lancement de l'arrosage");
        }
        
    }
};

module.exports = toExport;
