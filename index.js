const express = require("express"),
    app = express(),
    path = require("path"),
    axios = require("axios");

const darkskyRoutes = require("./routes/darksky"),
    farmbotRoutes = require("./routes/farmbot");

app.use("/assets", express.static(path.join(__dirname, "public")));
app.use("/api", darkskyRoutes);
app.use("/api", farmbotRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
