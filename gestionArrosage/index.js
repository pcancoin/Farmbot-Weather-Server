const farmbotApi = require("../services/farmbotApi"),
    config = require("../config"),
    darksky = require("../services/darksky"),
    farmbotControl = require("../services/farmbotControl"),
    Farmbot = require("farmbot").Farmbot,
    farmbot = new Farmbot({ token: config.farmbotToken });

global.atob = require("atob");

const errorHandler = (error) => {
    console.log("=== ERROR ===");
    console.dir(error);
  };

const start = () => {
    farmbot.connect()
    .then(() => { console.log("CONNECTED TO FARMBOT!"); })
    .catch(errorHandler);
}

module.exports = async function main() {
    await start();
}