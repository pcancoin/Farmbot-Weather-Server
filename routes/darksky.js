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

router.get("/darksky", (req, res) => {
    darkskyAPI.get("/48.1214379,-1.635091?lang=fr&units=si").then(result => {
        //Keep only the 25 last hourly data
        let hourlyData = result.data.hourly.data.splice(0, 25);

        //Keep only the pecipitation intensity
        let intensitySet = hourlyData.map((data, index) => {
            return data.precipIntensity;
        });

        //Generate color with opacity dependant on precipitation probability
        let probaSet = hourlyData.map((data, index) => {
            return `rgba(20, 80, 120, ${data.precipProbability.clamp(0, 1)})`;
        });

        //Create labels
        let labels = hourlyData.map((data, index) => {
            var d = new Date(0);
            d.setUTCSeconds(data.time);
            return (
                d
                    .getDate()
                    .toString()
                    .padStart(2, "0") +
                "/" +
                (d.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                d.getFullYear() +
                " : " +
                d.getHours() +
                "h" +
                d
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")
            );
        });

        console.log(labels);

        res.json({
            icon: result.data.currently.icon,
            summary: result.data.currently.summary,
            prevSummary: result.data.hourly.summary,
            temp: result.data.currently.temperature,
            precipitation: {
                labels,
                datasets: [
                    {
                        label: "Précipitation (mm/h)",
                        backgroundColor: probaSet,
                        data: intensitySet
                    }
                ]
            }
        });
    });
});

module.exports = router;
