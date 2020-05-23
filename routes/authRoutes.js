const express = require("express"),
    router = express.Router();


router.post("/login", (req, res) => {});

router.post("/signup", (req, res) => {
    console.log(req.body.email);
    
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/current_user", (req, res) => {
    res.json(req.user);
});

module.exports = router;
