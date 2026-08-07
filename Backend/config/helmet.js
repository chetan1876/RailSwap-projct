const helmet = require("helmet");

module.exports = helmet({
    crossOriginResourcePolicy: false,
});