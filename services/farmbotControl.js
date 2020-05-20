global.atob = require("atob");

const config = require("../config"),
    farmbotApi = require("../services/farmbotApi"),
    Farmbot = require("farmbot").Farmbot,
    farmbot = new Farmbot({ token: config.farmbotToken }),
    axios = require("axios");

const FARMBOT_STATE = {
    farmbot: undefined,
};

const SERVER = process.env.serverUrl;

const errorHandler = error => {
    console.log("=== ERROR ===");
    console.dir(error);
};

const toExport = {
    retrieveTokenAndConnect: async (email, password) => {
        const payload = { user: { email, password } };
        try {
            let res = await axios.post(SERVER + "/api/tokens", payload);
            let token = res.data.token.encoded;
            console.log(token);

            FARMBOT_STATE.farmbot = new Farmbot({ token });

            FARMBOT_STATE.farmbot
                .connect()
                .then(() => console.log("Connecté au Farmbot !"));

        } catch (error) {
            console.error("Erreur lors de la récupération du token", error);
        }
    },
    /**
     * Etablit la connexion avec le farmbot
     */
    start: () => {
        farmbot
            .connect()
            .then(() => {
                console.log("CONNECTED TO FARMBOT!");
            })
            .catch(errorHandler);
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
    goToPlant: async i => {
        var plantes = await farmbotApi.plantArray();
        var x = plantes[i].x;
        var y = plantes[i].y;
        await toExport.goTo(x, y, 0);
    },
    /**
     * Allume l'electrovanne pendant le temps (en ms) défini en paramètre
     */
    water: time => {
        farmbot.writePin({ pin_number: 8, pin_mode: 0, pin_value: 1 });
        function stopWater() {
            farmbot.writePin({ pin_number: 8, pin_mode: 0, pin_value: 0 });
        }
        setTimeout(stopWater, time);
    },
    /**
     * Lit la valeur du capteur d'humidité
     */
    readSoilSensor: () => {
        farmbot
            .readPin({ pin_number: 59, pin_mode: 0 })
            .catch(function (erreur) {
                console.log(erreur);
            });
    },
    /**
     * Lance la séquence mount tool avec l'outil tamis pour arroser
     * id de l'outil watering nozzle : 7043
     */
    mountWateringNozzle: () => {
        console.log("about to be mounted");
        farmbot.execSequence(24863, [
            {
                kind: "parameter_application",
                args: {
                    label: "parent",
                    data_value: { kind: "tool", args: { tool_id: 7770 } }, //id 7770 pour ne pas faire tomber un outil qui existe lors des tests
                },
            },
        ]);
        console.log("mounted");
    },
    /**
     * Lance la séquence unmount tool avec l'outil tamis pour arroser
     */
    unmountWateringNozzle: () => {
        farmbot.execSequence(24867, [
            {
                kind: "parameter_application",
                args: {
                    label: "parent",
                    data_value: { kind: "tool", args: { tool_id: 7770 } }, //idem que pour mountWateringNozzle
                },
            },
        ]);
    },
};

module.exports = toExport;
