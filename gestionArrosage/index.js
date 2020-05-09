global.atob = require("atob");

const farmbotApi = require("../services/farmbotApi"),
    config = require("../config"),
    darksky = require("../services/darksky"),
    farmbotControl = require("../services/farmbotControl");

/**
 * Calcule la distance entre 2 points de coordonnées (x,y) et (i,j)
 */
function distance (x,y,i,j){
    var res = Math.sqrt((x-i)*(x-i) + (y-j)*(y-j));
    return res;
}

/**
 * Renvoit la case du tableau plantes contenant la plante la plus proche du point de coordonnées (x,y)
 * @param {coordonnée x} x 
 * @param {coordonnée y} y 
 * @param {tableau de plantes} plantes 
 */
function distanceMin(x,y, plantes){
    var min = 3500;
    var planteNum = 0;
    for(let i = 0; i<plantes.length; i++){
      if(plantes[i] != -1){
        var dist = distance(x,y, plantes[i].x, plantes[i].y);
        if(dist != 0){
          if(min > dist){
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
async function parcours(){
    var parcours = [];
    var plantes = await farmbotApi.plantArray();
    parcours[0] = distanceMin(0,0, plantes);
    for (let i = 1; i<plantes.length; i++){
      parcours[i] = distanceMin(plantes[parcours[i-1]].x, plantes[parcours[i-1]].y, plantes);
      plantes[parcours[i-1]] = -1;
    }
    return parcours;
}

/**
 * Renvoit (besoin en eau) - (addition des précipitations des 12 prochaines heures)
 * C'est-à-dire combien de mm d'eau il faut arroser
 * @param {besoin en eau d'une plante} need 
 */
async function howMuchWatering(need){
    var tab = await darksky.precipIntensityProba();
    var precip = 0;
    for(let i=0; i<tab.length; i++){
      precip+=tab[i];
    }
    var res = need-precip;
    if(res<0){
      return 0;
    } else {
      return res;
    }
}

/**
 * Renvoit le temps d'arrosage nécessaire pour une plante
 * @param {mm d'eau par seconde de notre pompe} mmPerSec 
 * @param {besoin en eau en ml d'une plante} need 
 */
async function getTime(mmPerSec, need){
    var water = await howMuchWatering(need);
    var res = water/mmPerSec;
    return res;
}

/**
 * Lit la valeur du capteur d'humidité puis renvoit cette valeur 
 */
async function readAndGetSensor(){
    await farmbotControl.readSoilSensor();
    let res = await farmbotApi.getLastSensorReading();
    return res;
}

/**
 * Renvoit Vrai si le taux d'humidité du sol est inférieur à 50% (donc les plantes doivent être arrosées)
 */
async function isUnder50Percent(){
    let sensor = await readAndGetSensor();
    let res = 1 - sensor*100/1023;
    if(res < 0.5){
        return true;
    }else{
        return false;
    }
    
}


module.exports = async function main() {
    await farmbotControl.start();

    /*
    await getTime(1,3).then((time) => {
        console.log(time);
        return parcours().then((plantes) => {
            console.log(plantes);
            return farmbotControl.goToPlant(plantes[2]).then(() => {
                console.log("at plant");
                farmbotControl.water(time).then(() => {
                    console.log("done");
                });
            });
        });
    });
    */
   
};
