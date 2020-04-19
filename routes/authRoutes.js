const express = require("express"),
    router = express.Router(),
    passport = require("passport");

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res) => {
    passport.authenticate("google");
    res.redirect("/");
});

module.exports = router;
