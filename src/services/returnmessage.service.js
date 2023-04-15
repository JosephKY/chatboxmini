const ReturnMessage = require("../models/returnMessage.model");

function returnMessage(returnmessage, res){
    if(returnmessage == undefined || returnmessage.constructor == undefined || returnmessage.constructor.name != "ReturnMessage" || res == undefined || res.json == undefined){
        res.json(new ReturnMessage("0", "OK", 200, "nil"));
        return;
    }
    res.status(returnmessage.httpcode).json(returnmessage);
}

module.exports = returnMessage