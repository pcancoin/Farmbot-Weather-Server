const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    arrosageService = require("../services/arrosages"),
    only = require("only");

const requireAdmin = require("../middlewares/requireAdmin");

let jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
    try {
        let arrosages = await arrosageService.getArrosages(10);

        res.send(arrosages);
    } catch (err) {
        res.status(400).json({ error: "Impossible de récupérer les données d'arrosage" });
    }
});

router.post("/", jsonParser, async (req, res) => {
    let arrosage = req.body;
    console.log(req.body);
    arrosage = only(
        arrosage,
        "humidite indicateurMeteo"
    );

    try {
        let nouvelArrosage = await arrosageService.createArrosage(arrosage);
        console.log(nouvelArrosage);
        
        res.send(nouvelArrosage);
    } catch (err) {
        res.status(400).json({ error: "Impossible d'enregister cette entrée" });
    }
});

router.get("/run", requireAdmin, (req, res) => {

    arrosageService.launchArrosage();
    console.log("Arrosage demandé");
    res.send("Non configuré pour l'instant mais pris en compte");
});

module.exports = router;
