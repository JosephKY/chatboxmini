const jsonwebtoken = require("jsonwebtoken")
const jwtconfig = require("../configs/jwt.config")

function genJWT(payload={}){
    let token = jsonwebtoken.sign(payload, jwtconfig.key, { 'algorithm':jwtconfig.algorithm, "issuer":jwtconfig.issuer, "expiresIn": jwtconfig.expiresin});
    return token;
}

function valJWT(jwt){
    try {
        let decode= jsonwebtoken.verify(jwt, jwtconfig.key, {});
        return decode;
    } catch(err){
        return false;
    }
}

function isLoggedIn(req){
    if(!req || !req.cookies || !req.cookies.jwt)return false;
    return valJWT(req.cookies.jwt)
}

module.exports = {
    genJWT,
    valJWT,
    isLoggedIn
}