const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    passport = require("passport"),
    User = require("../models/User");

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
    })(req, res, next);
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/current_user", (req, res) => {
    res.json(req.user);
});

module.exports = router;
