const express = require("express"),
    router = express.Router(),
    darkskyAPI = require("../services/darksky"),
    path = require("path");

/**
 * Clamp the number between min and max values
 * @param min Minimum value of the number
 * @param max Maximum value of the number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

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

router.get("/darksky", (req, res) => {
    darkskyAPI
        .get("/48.1214379,-1.635091?lang=fr&units=si")
        .then(result => {
            res.json({
                icon: result.data.currently.icon,
                summary: result.data.currently.summary,
                prevSummary: result.data.hourly.summary,
                temp: result.data.currently.temperature
            });
        })
        .catch(err => {
            console.log("/darksky error : ", err);
            res.status(500);
            res.json({
                error:
                    "Erreur lors de la requête, veuillez contacter un administrateur"
            });
        });
});

router.get("/darksky/precipitation", (req, res) => {
    darkskyAPI
        .get("/48.1214379,-1.635091?lang=fr&units=si")
        .then(result => {
            //Objet vide a remplir par les donnees de precipitation
            var precipitation = {
                labels: [],
                datasets: [
                    {
                        label: "Précipitation (mm/h)",
                        backgroundColor: [],
                        data: []
                    }
                ]
            };

            precipitation = result.data.hourly.data
                .splice(0, 24) //Garder seulement les 24 prochaines heures
                .reduce((acc, val) => {
                    //Générer le label et l'ajouter au tableau des labels
                    var d = new Date(0);
                    d.setUTCSeconds(val.time);
                    acc.labels.push(d.getLabel());

                    //Ajout de la couleur (en fonction de l'intensité)
                    acc.datasets[0].backgroundColor.push(
                        `rgba(20, 80, 120, ${val.precipProbability.clamp(
                            0,
                            1
                        )})`
                    );

                    //Ajout de la quantité de pluie prévue
                    acc.datasets[0].data.push(val.precipIntensity);

                    return acc;
                }, precipitation);
            res.json(precipitation);
        })
        .catch(err => {
            console.log("/darksky/precipitation error : ", err);
            res.status(500);
            res.json({
                error:
                    "Erreur lors de la requête, veuillez contacter un administrateur"
            });
        });
});

module.exports = router;
