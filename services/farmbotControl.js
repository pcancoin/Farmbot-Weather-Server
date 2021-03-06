global.atob = require("atob");

const farmbotApi = require("../services/farmbotApi"),
    Farmbot = require("farmbot").Farmbot,
    axios = require("axios");

let farmbot = undefined;

const SERVER = process.env.serverUrl;

const toExport = {
    /**
     * Récupère le token associé au compte FarmBot, crée l'objet Farmbot grâce au token, puis se connecte au robot
     * @param {string} email Email du compte FarmBot
     * @param {string} password Mot de passe du compte FarmBot
     */
    retrieveTokenAndConnect: async (email, password) => {
        const payload = { user: { email, password } };
        try {
            console.log("Recuperation du token pour FarmbotJS...");
            
            let res = await axios.post(SERVER + "/api/tokens", payload);
            let token = res.data.token.encoded;
            console.log("Token récupéré :", token);
            
            console.log("Connexion au Farmbot avec FarmbotJS...");
            
            farmbot = new Farmbot({ token });

            try {
                await farmbot.connect();
            } catch (error) {
                console.error("Erreur lors de la connexion avec FarmbotJS :", error);
            }
            
            console.log("Connecté au Farmbot !");
        } catch (error) {
            console.error("Erreur lors de la récupération du token cote FarmbotJS", error);
        }
    },
    /**
     * Positionne le robot en (x,y,z)
     * @param {number} x Coordonnées sur l'axe x
     * @param {number} y Coordonnées sur l'axe y
     * @param {number} z Coordonnées sur l'axe z
     */
    goTo: (x, y, z) => {
        farmbot.moveAbsolute({ x: x, y: y, z: z });
    },
    /**
     * Positionne le robot au-dessus de la ième plante
     * @param {number} i Numéro de la plante
     */
    goToPlant: async (i) => {
        var plantes = await farmbotApi.plantArray();
        var x = plantes[i].x;
        var y = plantes[i].y;
        await toExport.goTo(x, y, 0);
    },
    /**
     * Allume l'electrovanne pendant le temps défini en paramètre
     * @param {number} time Temps d'arrosage en milisecondes
     * @param {number} waterPin Pin de l'electrovanne
     */
    water: (time,waterPin) => {
        farmbot.writePin({ pin_number: waterPin, pin_mode: 0, pin_value: 1 });
        function stopWater() {
            farmbot.writePin({ pin_number: waterPin, pin_mode: 0, pin_value: 0 });
        }
        setTimeout(stopWater, time);
    },
    /**
     * Lit la valeur du capteur d'humidité
     * @param {number} sensorPin Pin du capteur d'humidité
     */
    readSoilSensor: (sensorPin) => {
        farmbot
            .readPin({ pin_number: sensorPin, pin_mode: 0 })
            .catch(function (erreur) {
                console.log(erreur);
            });
    },
    /**
     * Lance la séquence Mount Tool avec l'outil d'arrosage
     * @param {number} wateringToolID Id de l'outil d'arrosage
     * @param {number} sequenceID Id de la séquence permettant de monter un outil
     */
    mountWateringNozzle: (wateringToolID,sequenceID) => {
        console.log("about to be mounted");
        farmbot.execSequence(sequenceID, [
            {
                kind: "parameter_application",
                args: {
                    label: "parent",
                    data_value: { kind: "tool", args: { tool_id: wateringToolID } },
                },
            },
        ]);
        console.log("mounted");
    },
    /**
     * Lance la séquence Unmount Tool avec l'outil d'arrosage
     * @param {number} wateringToolID Id de l'outil d'arrosage
     * @param {number} sequenceID Id de la séquence permettant de démonter un outil
     */
    unmountWateringNozzle: (wateringToolID, sequenceID) => {
        farmbot.execSequence(sequenceID, [
            {
                kind: "parameter_application",
                args: {
                    label: "parent",
                    data_value: { kind: "tool", args: { tool_id: wateringToolID } }, 
                },
            },
        ]);
    },
};

module.exports = toExport;
