const farmbotApi = require("../services/farmbotApi"),
    darksky = require("../services/darksky"),
    farmbotControl = require("../services/farmbotControl"),
    settingsService = require("../services/settings");

/**
 * Calcule la distance entre 2 points de coordonnées (x,y) et (i,j)
 * @param {coordonnée sur l'axe x du premier point} x
 * @param {coordonnée sur l'axe y du premier point} y
 * @param {coordonnée sur l'axe x du deuxième point} i
 * @param {coordonnée sur l'axe y du deuxième point} j
 */
function distance(x, y, i, j) {
    var res = Math.sqrt((x - i) * (x - i) + (y - j) * (y - j));
    return res;
}

/**
 * Renvoit la case du tableau plantes contenant la plante la plus proche du point de coordonnées (x,y)
 * @param {coordonnée sur l'axe x} x
 * @param {coordonnée sur l'axe y} y
 * @param {tableau de plantes} plantes
 */
function distanceMin(x, y, plantes) {
    var min = 3500;
    var planteNum = 0;
    for (let i = 0; i < plantes.length; i++) {
        if (plantes[i] != -1) {
            var dist = distance(x, y, plantes[i].x, plantes[i].y);
            if (dist != 0) {
                if (min > dist) {
                    min = dist;
                    planteNum = i;
                }
            }
        }
    }
    return planteNum;
}
/**
 * Renvoit un tableau contenant les numéros des plantes dans l'ordre d'arrosage
 */
async function parcours() {
    var parcours = [];
    var plantes = await farmbotApi.plantArray();
    parcours[0] = distanceMin(0, 0, plantes);
    for (let i = 1; i < plantes.length; i++) {
        parcours[i] = distanceMin(
            plantes[parcours[i - 1]].x,
            plantes[parcours[i - 1]].y,
            plantes
        );
        plantes[parcours[i - 1]] = -1;
    }
    return parcours;
}

/**
 * Renvoit (besoin en eau) - (addition des précipitations des 12 prochaines heures)
 * C'est-à-dire combien de mm d'eau il reste à arroser
 * @param {besoin en eau d'une plante en mm} need
 */
async function howMuchWatering(need) {
    var tab = await darksky.precipIntensityProba();
    var precip = 0;
    for (let i = 0; i < tab.length; i++) {
        precip += tab[i];
    }
    var res = need - precip;
    if (res < 0) {
        return 0;
    } else {
        return res;
    }
}

/**
 * Renvoit le temps d'arrosage nécessaire pour une plante
 * @param {mm d'eau par seconde de fournis par l'electrovanne} mmPerSec
 * @param {besoin en eau en mm d'une plante} need
 */
async function getTime(mmPerSec, need) {
    let water = await howMuchWatering(need);
    let time = water / mmPerSec;
    return time;
}

/**
 * Lit la valeur du capteur d'humidité puis renvoit cette valeur
 * @param {pin du capteur d'humidité} sensorPin
 */
async function readAndGetSensor(sensorPin) {
    await farmbotControl.readSoilSensor(sensorPin);
    let res = await farmbotApi.getLastSensorReading(sensorPin);
    return res;
}

/**
 * Renvoit Vrai si le taux d'humidité du sol est inférieur au seuil (initialisé à 0.5 dans les réglages)
 * @param {seuil d'humidité défini dans les réglages} threshold
 * @param {pin du capteur d'humidité} sensorPin
 */
async function isUnderHumidityThreshold(threshold,sensorPin) {
    let sensor = await readAndGetSensor(sensorPin);
    let res = 1 - (sensor * 100) / 1023;
    if (res < threshold) {
        return true;
    } else {
        return false;
    }
}

module.exports = async function main() {

    /*
    let set = await settingsService.getSettings();

    if(isUnderHumidityThreshold(set.humidityThreshold,set.sensorPin)){
        let waterQuantity = await howMuchWatering(set.waterNeed);
        console.log(waterQuantity);
        let time = await getTime(1,waterQuantity);
        console.log(time);
        let parc = await parcours();
        console.log(parc);
        
        await farmbotControl.mountWateringNozzle(set.toolID,set.sequenceMountToolID);
        for(let i=0; i<parc.length; i++){
            await farmbotControl.goToPlant(parc[i]);
            await farmbotControl.water(time,set.valvePin);
        }
        await farmbotControl.unmountWateringNozzle(set.toolID,set.sequenceUnmountToolID);
        
    }
    */
};
