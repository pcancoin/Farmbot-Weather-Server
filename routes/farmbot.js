const express = require("express"),
    router = express.Router(),
    farmbotAPI = require("../services/farmbot");

router.get("/farmbot", (req, res) => {
    farmbotAPI
        .get("/sensor_readings")
        .then(({ data }) => {
            soilReadings = data
                .filter(reading => reading["pin"] === 59) //Garder uniquement les mesures du capteurs d'humidité
                .splice(0, 25) //Garder les 25 dernières mesures
                //Tri des valeurs par date croissante
                .sort((set1, set2) => {
                    var d1 = new Date(set1.read_at);
                    var d2 = new Date(set2.read_at);
                    return d1.getTime() - d2.getTime();
                })
                //Garder uniquement les valeurs utiles (valeur et date de lecture) et mettre en forme la date
                .reduce((acc, val) => {
                    date = new Date(val.read_at);

                    date =
                        date
                            .getDate()
                            .toString()
                            .padStart(2, "0") +
                        "/" +
                        (date.getMonth() + 1).toString().padStart(2, "0") +
                        "/" +
                        date.getFullYear() +
                        " : " +
                        date.getHours() +
                        "h" +
                        date
                            .getMinutes()
                            .toString()
                            .padStart(2, "0");

                    acc.push({
                        date,
                        value: Math.floor(((1023 - val.value) * 100) / 1023)
                    });

                    return acc;
                }, []);

            console.log(soilReadings);

            res.json(soilReadings);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
