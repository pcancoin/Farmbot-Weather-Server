const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    Settings = require("../models/Settings"),
    only = require("only");

let jsonParser = bodyParser.json();

router.get("/", async (req, res) => {
    settings = await Settings.findOne({},  { '_id': 0 });
    console.log(settings);

    res.send(settings);
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
        settings = await Settings.findOneAndUpdate({}, reglages, { new: true });
        console.log(settings);
        res.send("ok");
    } catch(e) {
        console.log(e);
        res.status(400).json({error: "Paramètres incorrects"});
        
    }
    
    
    
});

module.exports = router;
