const express = require("express"),
    router = express.Router(),
    settingsService = require("../services/settings"),
    only = require("only");

const requireAdmin = require("../middlewares/requireAdmin");

router.get("/", requireAdmin, async (req, res) => {
    try {
        let settings = await settingsService.getSettings();

        res.send(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/", requireAdmin, async (req, res) => {
    let reglages = req.body;
    console.log(req.body);
    reglages = only(
        reglages,
        "toolID valvePin waterNeed humidityThreshold sensorPin lat long sequenceMountToolID sequenceUnmountToolID"
    ); 

    try {
        let nouveauReglages = await settingsService.setSettings(reglages);

        res.send(nouveauReglages);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
