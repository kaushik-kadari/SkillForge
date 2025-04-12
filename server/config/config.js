// config/config.js

const config = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI ,
    SECRET_KEY: process.env.SECRET_KEY,
    API_KEY: process.env.API_KEY
};


module.exports = config;
