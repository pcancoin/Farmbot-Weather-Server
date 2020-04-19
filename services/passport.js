const passport = require("passport"),
    GoogleStrategy = require("passport-google-oauth20"),
    config = require("../config");

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientID,
            clientSecret: config.googleClientSecret,
            callbackURL: "/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
        }
    )
);
