const LocalStrategy = require("passport-local").Strategy,
    mongoose = require("mongoose"),
    bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = function (passport) {
    User.findOne({ admin: true })
        .then(admin => {
            if (admin === null) {
                let newUser = new User({
                    username: "admin",
                    password: process.env.adminPass,
                    admin: true,
                });

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;

                        newUser
                            .save()
                            .then(user => {
                                console.log("Compte admin initialisé !");
                            })
                            .catch(error => {
                                throw error;
                            });
                    })
                );
            } else {
                console.log("Compte admin déjà présent");
            }
        })
        .catch(err => {
            console.log(
                "Erreur lors de l'ajout du compte administrateur :",
                err
            );
        });

    passport.use(
        new LocalStrategy(
            { usernameField: "username" },
            (username, password, done) => {
                User.findOne({ username: username })
                    .then(user => {
                        if (!user) {
                            return done(null, false, {
                                message:
                                    "Nom d'utilisateur ou mot de passe incorrect",
                            });
                        }

                        bcrypt.compare(
                            password,
                            user.password,
                            (err, isMatch) => {
                                if (err) throw err;

                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    return done(null, false, {
                                        message:
                                            "Nom d'utilisateur ou mot de passe incorrect",
                                    });
                                }
                            }
                        );
                    })
                    .catch(err => console.log(err));
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(
            id,
            { password: 0, date: 0, _id: 0, __v: 0 },
            (err, user) => {
                done(err, user);
            }
        );
    });
};
