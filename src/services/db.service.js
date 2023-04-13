const dbModel = require("../models/db.model")

async function newdb(){
    let db = new dbModel.Database();
    let errO = false;
    await db.conn;
    (await db.conn).connect((err)=>{
        if(err){
            errO = true
        }
    })

    if(errO){
        return false;
    }
    return db.conn;
}

module.exports = {
    newdb
}