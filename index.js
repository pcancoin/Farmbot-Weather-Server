if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express"),
    app = express(),
    path = require("path"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    cookieSession = require("cookie-session"),
    reglagesServices = require("./services/settings"),
    farmbotControl = require("./services/farmbotControl"),
    farmbotApi = require("./services/farmbotApi"),
    passport = require("passport");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//Configuration de passport
require("./services/passport")(passport);

mongoose
    .connect(process.env.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(async () => {
        console.log("Connected to MongoDB");
        await farmbotApi.initToken(
            process.env.farmbotMail,
            process.env.farmbotPassword
        );
        await farmbotControl.retrieveTokenAndConnect(
            process.env.farmbotMail,
            process.env.farmbotPassword
        );
        reglagesServices.initSettings();
    });

//Configuration de Cookie Session pour l'authentification
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.cookieKey],
    })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes"),
    darkskyRoutes = require("./routes/darksky"),
    farmbotRoutes = require("./routes/farmbot"),
    settingsRoutes = require("./routes/settings"),
    arrosageRoutes = require("./routes/arrosage");

app.use("/", express.static(path.join(__dirname, "client")));
app.use("/api/auth", authRoutes);
app.use("/api/darksky", darkskyRoutes);
app.use("/api/farmbot", farmbotRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/arrosage", arrosageRoutes);
app.use("*", express.static(path.join(__dirname, "client")));

app.use(function (err, req, res, next) {
    console.error(err.stack);

    // Error de body parser
    if (err.type === "entity.parse.failed") {
        res.status(400).json({ error: "Bad syntax" });
    }

    //Autre erreurs
    else {
        res.status(500).send("Something broke!");
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
