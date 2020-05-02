module.exports = (req, res, next) => {
    if (!req.user) {
        res.status(401);
        res.json({ error: "Veuillez vous connecter" });
    }
    next();
};
