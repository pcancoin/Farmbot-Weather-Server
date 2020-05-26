const axios = require("axios");

    
let settingsService = require("./settings");

let farmbotAPI; 

const SERVER = process.env.serverUrl;

const toExport = {
    /**
     * Récupère le token associé au compte FarmBot et crée la requête pré-paramétrée farmbotAPI
     * @param {string} email Email du compte FarmBot
     * @param {string} password Mot de passe du compte FarmBot
     */
    initToken: async (email, password) => {
        const payload = { user: { email, password } };
        try {
            console.log("Récuperation du token pour l'API...");
            
            let res = await axios.post(SERVER + "/api/tokens", payload);
            let token = res.data.token.encoded;

            farmbotAPI = axios.create({
                baseURL: SERVER + "/api",
                timeout: 2000,
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du token cote API", error);
        }
    },
    /**
     * Renvoie toutes les données du capteur d'humidité
     * @param {number} sensorPin Pin du capteur d'humidité
     */
    getSensorReadings: async (sensorPin) => {
        let res = await farmbotAPI.get("/sensor_readings");
        
        //Garder uniquement les mesures du capteurs d'humidité
        let data = res.data.filter((reading) => reading["pin"] === sensorPin);
        return data;
    },

    /**
     * Renvoie la dernière mesure du capteur d'humidité
     * @param {number} sensorPin Pin du capteur d'humidité
     */
    getLastSensorReading: async (sensorPin) => {
        let data = await toExport.getSensorReadings(sensorPin);
        return data[data.length - 1].value;
    },

    /**
     * Renvoie le tableau de toutes les plantes enregistrées
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
     * Renvoie le tableau des séquences
     */
    getSequences: async () => {
        let res = await farmbotAPI.get("/sequences");
        return res.data;
    },
    /**
     * Renvoie l'id de la séquence permettant de monter un outil
     */
    getMountToolID: async () => {
        let sequences = await toExport.getSequences()
        for({name,id} of sequences) {
            if(name === "Mount tool"){
                return id;
            }
        }
        return null;
    },    
    /**
     * Renvoie l'id de la séquence permettant de démonter un outil
     */
    getUnmountToolID: async () => {
        let sequences = await toExport.getSequences()
        for({name,id} of sequences) {
            if(name === "Unmount tool"){
                return id;
            }
        }
        return null;
    },    
    /**
     * Renvoie la liste des outils
     */
    getTools: async () => {
        let res = await farmbotAPI.get("/tools");
        return res.data;
    },
    /**
     * Renvoie l'id de l'outil qui permet d'arroser (Watering Nozzle)
     */
    getWateringID: async () => {
        let tools = await toExport.getTools()
        for({name,id} of tools) {
            if(name === "Watering Nozzle"){
                return id;
            }
        }
        return null;
    },
    /**
     * Renvoie le pin de l'électrovanne
     */
    getValvePin: async () => {
        let pins = await farmbotAPI.get("/peripherals");
        for({label,pin} of pins.data){
            if(label === "Water / electrovanne"){
                return pin;
            }
        }
        return null;
    },
    /**
     * Renvoie le pin du capteur d'humidité
     */
    getSensorPin: async () => {
        let sensors = await farmbotAPI.get("/sensors");
        for({label,pin} of sensors.data){
            if(label === "Soil Sensor"){
                return pin;
            }
        }
        return null;
    }
};

module.exports = toExport;
