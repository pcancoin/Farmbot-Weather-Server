const express = require("express"),
    router = express.Router(),
    farmbotAPI = require("../services/farmbot");

Date.prototype.getLabel = function() {
    return (
        this.getDate()
            .toString()
            .padStart(2, "0") +
        "/" +
        (this.getMonth() + 1).toString().padStart(2, "0") +
        " : " +
        this.getHours() +
        "h" +
        this.getMinutes()
            .toString()
            .padStart(2, "0")
    );
};

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
                    let date = new Date(val.read_at);

                    acc.push({
                        date: date.getLabel(),
                        value: Math.floor(((1023 - val.value) * 100) / 1023)
                    });

                    return acc;
                }, []);

            console.log(soilReadings);

            res.json(soilReadings);
        })
        .catch(err => {
            console.log("Farmbot", err);
            res.status(500);
            res.json({
                error:
                    "Erreur lors de la requête vers Farmbot, veuillez contacter un administrateur"
            });
        });
});

module.exports = router;
