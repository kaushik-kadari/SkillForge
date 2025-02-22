// Authentication middleware
const cors = require('cors');

module.exports = (req, res, next) => {
    // Logic for authentication
    cors()(req, res, next);
};
