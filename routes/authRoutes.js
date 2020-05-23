const express = require("express"),
    router = express.Router(),
    bcrypt = require("bcrypt"),
    passport = require("passport"),
    User = require("../models/User");


router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login"
    })(req, res, next);
});

router.post("/signup", (req, res, next) => {
    console.log(req.body.username, req.body.password);
    let newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) {
            next(err);
        }

        newUser.password = hash;

        newUser.save().then(user => {
            res.redirect("/auth/login");
        }).catch((error) => {
            console.log(error);
            next(error);
        });
    }))
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/current_user", (req, res) => {
    res.json(req.user);
});

module.exports = router;
