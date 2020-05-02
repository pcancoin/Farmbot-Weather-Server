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
    })
    .then(() => console.log("Connected to MongoDB"));

require("./services/passport");

//Configuration de Cookie Session pour l'authentification
app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [config.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());



const authRoutes = require("./routes/authRoutes"),
    darkskyRoutes = require("./routes/darksky"),
    farmbotRoutes = require("./routes/farmbot");

app.use("/assets", express.static(path.join(__dirname, "public")));
app.use("/api/auth", authRoutes);
app.use("/api", darkskyRoutes);
app.use("/api", farmbotRoutes);

app.get("*", (req, res) => {
    res.json("Nothing here");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
