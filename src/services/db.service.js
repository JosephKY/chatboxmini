// Models
const dbModel = require("../models/db.model");
const ReturnMessage = require("../models/returnMessage.model");

// Services
const cacheService = require("./cache.service")

async function newdb() {
    let c = cacheService.getCache("dbconn", "main")
    if(c != false){
        console.log("Using DB Cache")
        return c;
    }
    try {
        let db = new dbModel.Database();
        let errO = false;
        await db.conn;
        (await db.conn).connect((err) => {
            if (err) {
                errO = true
            }
        })

        if (errO) {
            return false;
        }
        db
        cacheService.setCache("dbconn", "main", db.conn, 9, true)
        return db.conn;
    } catch (err) {
        console.log(err);
        cacheService.delCache("dbconn", "main")
        return false;
    }
}

module.exports = {
    newdb
}