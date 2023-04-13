// Models
const dbModel = require("../models/db.model");
const ReturnMessage = require("../models/returnMessage.model");

async function newdb() {
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
        return db.conn;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    newdb
}