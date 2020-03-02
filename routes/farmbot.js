const express = require("express"),
    router = express.Router(),
    farmbotAPI = require("../services/farmbot");

router.get("/farmbot", (req, res) => {
    farmbotAPI
        .get("/sensor_readings")
        .then(({ data }) => {
            soilReadings = data.filter(reading => reading["pin"] === 59);
            reducedData = soilReadings.reduce((acc, val) => {
                acc.push({
                    date: val.read_at,
                    value: val.value
                });

                return acc;
            }, []);
            console.log(reducedData);

            res.json(reducedData);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
