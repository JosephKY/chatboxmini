const mysql = require('mysql2/promise')
const db = require("../configs/db.config")

class Database {
    constructor() {
        this.conn = mysql.createConnection({
            host: db.host,
            user: db.user,
            password: db.pass,
            database:db.db,
            port: db.port
        })
    }
}

module.exports = {
    Database
}