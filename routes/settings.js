const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    settingsService = require("../services/settings"),
    only = require("only");

let jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
    try {
        let settings = await settingsService.getSettings();
        console.log(settings);

        res.send(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/", jsonParser, async (req, res) => {
    let reglages = req.body;
    console.log(req.body);
    reglages = only(
        reglages,
        "toolID valvePin wateringThreshold weatherThreshold sensorPin"
    );
    console.log(reglages);

    try {
        let nouveauReglages = await settingsService.setSettings(reglages);

        res.send(nouveauReglages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
