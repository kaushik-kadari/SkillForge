// config/config.js

const config = {
    PORT: process.env.PORT || 3000,
    DB_URI: process.env.DB_URI ,
    SECRET_KEY: process.env.SECRET_KEY,
    API_KEY: process.env.API_KEY,
    JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
    JUDGE0_API_HOST: process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com",
    JUDGE0_API_URL: process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com",
};


module.exports = config;
