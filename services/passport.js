const LocalStrategy = require("passport-local").Strategy,
    mongoose = require("mongoose"),
    bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = function (passport) {
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
        User.findById(id, { password: 0, date: 0, _id: 0, __v: 0 }, (err, user) => {
            done(err, user);
        });
    });
};
