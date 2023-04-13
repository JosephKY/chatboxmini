const env = process.env;

let db = {
    host: env.DB_HOST || "127.0.0.1",
    user: env.DB_USER || "root",
    pass: env.DB_PASS || "",
    db: env.DB_NAME || "chatboxmini",
    port: env.DB_PORT || 3306
};

module.exports = db;