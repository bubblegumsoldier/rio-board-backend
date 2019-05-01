var getenv = require("getenv");
module.exports = getenv("JWT_SECRET","TEST") || "TEST";