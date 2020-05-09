if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

module.exports = {
    darkskyKey: process.env.darkskyKey,
    farmbotToken: process.env.farmbotToken,
    mongodb: process.env.mongodb,
    googleClientID: process.env.googleClientID,
    googleClientSecret: process.env.googleClientSecret,
    cookieKey: process.env.cookieKey
};