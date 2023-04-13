function returnMessage(returnmessage, res){
    if(returnmessage.constructor == undefined || returnmessage.constructor.name != "ReturnMessage" || res == undefined || res.json == undefined)return false;
    res.status(returnmessage.httpcode).json(returnmessage);
}

module.exports = returnMessage