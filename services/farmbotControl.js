global.atob = require("atob");

const farmbotApi = require("../services/farmbotApi"),
    Farmbot = require("farmbot").Farmbot,
    axios = require("axios"),
    Token = require("../models/Token");

let farmbot = undefined;

const SERVER = process.env.serverUrl;

const errorHandler = (error) => {
    console.log("=== ERROR ===");
    console.dir(error);
};

const toExport = {
    retrieveTokenAndConnect: async (email, password) => {
        const payload = { user: { email, password } };
        try {
            console.log("Recup du token pour FarmbotJS");
            
            let res = await axios.post(SERVER + "/api/tokens", payload);
            let token = res.data.token.encoded;

            farmbot = new Farmbot({ token });

            await farmbot.connect();
            console.log("Connecté au Farmbot !");
        } catch (error) {
            console.error("Erreur lors de la récupération du token", error);
        }
    },
    /**
     * Positionne le robot en (x,y,z)
     */
    goTo: (x, y, z) => {
        farmbot.moveAbsolute({ x: x, y: y, z: z });
    },
    /**
     * Positionne le robot au-dessus de la ième plante
     * @param {numéro de la plante} i
     */
    goToPlant: async (i) => {
        var plantes = await farmbotApi.plantArray();
        var x = plantes[i].x;
        var y = plantes[i].y;
        await toExport.goTo(x, y, 0);
    },
    /**
     * Allume l'electrovanne pendant le temps (en ms) défini en paramètre
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
     */
    readSoilSensor: (sensorPin) => {
        farmbot
            .readPin({ pin_number: sensorPin, pin_mode: 0 })
            .catch(function (erreur) {
                console.log(erreur);
            });
    },
    /**
     * Lance la séquence mount tool avec l'outil tamis pour arroser
     * id de l'outil watering nozzle : 7043
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
     * Lance la séquence unmount tool avec l'outil tamis pour arroser
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
