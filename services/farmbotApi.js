const axios = require("axios"),
    config = require("../config");

let farmbotAPI = axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken
    }
});

module.exports = {
    //renvoit toutes les données du capteur d'humidité
    getSensorReadings: async () => {
        let res = await farmbotAPI.get("/sensor_readings");
        console.log(typeof res);
        
        return res.data;
    },
    //renvoit la dernière donnée du capteur d'humidité (il faut encore lire le capteur avant)
    getLastSensorReading: async () => {
        let res = await farmbotAPI.get("/sensor_readings");
        let i = 1;
        while(res.data[res.data.length-i].pin!=59){
          i++;
        }
        let valeur=res.data[res.data.length-i].value;
        return valeur;
    },
    //renvoit le tableau avec toutes les plantes
    plantArray: async () => {
        let tab = [];
        let res = await farmbotAPI.get("/points");
        for(let i=0; i<res.data.length; i++){
            if(res.data[i].pointer_type == 'Plant'){
                tab.push(res.data[i]);
            }
        }
        return tab;
    },
    //renvoit le tableau des séquences
    getSequences: async () =>{
        let res = await farmbotAPI.get("/sequences");
        console.log(res.data);
        return res.data;
    },
    //Renvoit la liste des outils
    getTools: async () => {
        let res = await farmbotAPI.get("/tools");
        console.log(res.data);
        return res.data;

  }
    
}

/*module.exports =axios.create({
    baseURL: "https://my.farm.bot/api",
    timeout: 2000,
    headers: {
        Authorization: config.farmbotToken
    }
});*/
