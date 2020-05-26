const express = require("express"),
    router = express.Router(),
    darkskyAPI = require("../services/darksky");

/**
 * Mapper le nombre d'un intervalle à un autre
 * @param {number} in_min Min intervalle de départ
 * @param {number} in_max Max intervalle de départ
 * @param {number} out_min Min intervalle d'arrivée
 * @param {number} out_min Max intervalle d'arrivée
 */
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (
        ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
};

Date.prototype.getLabel = function () {
    return (
        this.getDate().toString().padStart(2, "0") +
        "/" +
        (this.getMonth() + 1).toString().padStart(2, "0") +
        " : " +
        this.getHours() +
        "h" +
        this.getMinutes().toString().padStart(2, "0")
    );
};

router.get("/", async (req, res) => {
    try {
        let data = await darkskyAPI.getAllForecast();
        res.json({
            icon: data.currently.icon,
            summary: data.currently.summary,
            prevSummary: data.hourly.summary,
            temp: data.currently.temperature,
        });
    } catch (err) {
        console.log("/darksky error : ", err);
        res.status(500);
        res.json({
            error:
                "Erreur lors de la requête, veuillez contacter un administrateur",
        });
    }
});

router.get("/precipitation", async (req, res) => {
    try {
        let data = await darkskyAPI.getAllForecast();

        var precipitation = {
            labels: [],
            datasets: [
                {
                    label: "Précipitation (mm/h)",
                    backgroundColor: [],
                    data: [],
                },
            ],
        };

        precipitation = data.hourly.data
            .splice(0, 24) //Garder seulement les 24 prochaines heures
            .reduce((acc, val) => {
                //Générer le label et l'ajouter au tableau des labels
                var d = new Date(0);
                d.setUTCSeconds(val.time);
                acc.labels.push(d.getLabel());

                //Ajout de la couleur (en fonction de l'intensité)
                acc.datasets[0].backgroundColor.push(
                    `rgba(20, 80, 120, ${val.precipProbability.map(
                        0,
                        1,
                        0.2,
                        1
                    )})`
                );

                //Ajout de la quantité de pluie prévue
                acc.datasets[0].data.push(val.precipIntensity);

                return acc;
            }, precipitation);
        res.json(precipitation);
    } catch (err) {
        console.log("/darksky/precipitation error : ", err);
        res.status(500);
        res.json({
            error:
                "Erreur lors de la requête, veuillez contacter un administrateur",
        });
    }
});

module.exports = router;
