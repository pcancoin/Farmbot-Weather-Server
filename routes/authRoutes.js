const express = require("express"),
    router = express.Router(),
    passport = require("passport");

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/current_user", (req, res) => {
    res.json(req.user);
});

module.exports = router;
