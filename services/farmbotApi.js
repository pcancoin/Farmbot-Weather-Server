const axios = require("axios"),
    Token = require("../models/Token");

    
let settingsService = require("./settings");

let farmbotAPI; 

const SERVER = process.env.serverUrl;

const toExport = {
    initToken: async (email, password) => {
        const payload = { user: { email, password } };
        try {
            console.log("Récuperationdu token...");
            
            let res = await axios.post(SERVER + "/api/tokens", payload);
            let token = res.data.token.encoded;

            farmbotAPI = axios.create({
                baseURL: "https://my.farm.bot/api",
                timeout: 2000,
                headers: {
                    Authorization: token,
                },
            });
        } catch (error) {
            console.error("Erreur lors de la récupération du token", error);
        }
    },
    /**
     * Renvoit toutes les données du capteur d'humidité
     */
    getSensorReadings: async (sensorPin) => {
        let res = await farmbotAPI.get("/sensor_readings");
        
        //Garder uniquement les mesures du capteurs d'humidité
        let data = res.data.filter((reading) => reading["pin"] === sensorPin);
        return data;
    },

    /**
     * Renvoit la dernière donnée du capteur d'humidité
     */
    getLastSensorReading: async (sensorPin) => {
        let data = await toExport.getSensorReadings(sensorPin);
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
        return res.data;
    },

    getMountToolID: async () => {
        let sequences = await toExport.getSequences()
        for({name,id} of sequences) {
            if(name === "Mount tool"){
                return id;
            }
        }
        return null;
    },    

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
     * Renvoit la liste des outils
     */
    getTools: async () => {
        let res = await farmbotAPI.get("/tools");
        return res.data;
    },
    /**
     * Renvoit l'id de l'outil Watering Nozzle
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
     * Renvoit le pin de l'électrovanne
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
