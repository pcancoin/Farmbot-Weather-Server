const passport = require("passport"),
    GoogleStrategy = require("passport-google-oauth20"),
    User = require("../models/User");

passport.serializeUser((user, done) => {
    //Identification de l'utilisateur par son ID MongoDB
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.googleClientID,
            clientSecret: process.env.googleClientSecret,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            //On verifie si l'utilisateur est deja enregistre
            const existingUser = await User.findOne({
                providerId: profile.id,
                provider: "Google",
            });
            console.log(profile);

            //Si l'utilisateur n'existe pas deja
            if (!existingUser) {
                //On le cree
                const newUser = await User.create({
                    providerId: profile.id,
                    provider: "Google",
                    name: profile.displayName,
                    email:
                        profile.emails.length > 0
                            ? profile.emails[0].value
                            : "",
                });

                console.log("Done adding ", newUser);
                //Poursuite de l'authentification
                done(null, newUser);
            }

            //L'utilisateur existe deja, pas besoin de l'ajouter
            done(null, existingUser);
        }
    )
);
