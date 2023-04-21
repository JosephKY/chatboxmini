const mysql = require('mysql2/promise')
const db = require("../configs/db.config")

class Database {
    constructor() {
        this.conn = mysql.createConnection({
            host: db.host,
            user: db.user,
            password: db.pass,
            database:db.db,
            port: db.port,
            maxIdle:10,
            idleTimeout:10000
        })
    }
}

module.exports = {
    Database
}