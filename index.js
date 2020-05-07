const express = require("express"),
    app = express(),
    path = require("path"),
    mongoose = require("mongoose"),
    config = require("./config"),
    passport = require("passport"),
    cookieSession = require("cookie-session");

mongoose
    .connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB"));

require("./services/passport");

//Configuration de Cookie Session pour l'authentification
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [config.cookieKey],
    })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/authRoutes"),
    darkskyRoutes = require("./routes/darksky"),
    farmbotRoutes = require("./routes/farmbot"),
    settingsRoutes = require("./routes/settings");

app.use("/assets", express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api/darksky", darkskyRoutes);
app.use("/api/farmbot", farmbotRoutes);
app.use("/api/settings", settingsRoutes);

app.get("*", (req, res) => {
    res.json("Nothing here");
});

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
