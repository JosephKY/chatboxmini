require("dotenv").config()
const env = process.env;

let jwt = {
    "issuer":"chatboxmini",
    "algorithm":"HS256",
    "expiresin": 15780000,
    "key": env.SECRET || "secret123",
    "passAlgorithm":"sha256",
    "salt": env.SALT || "5fb57212ff8f9c387348b65b17e",
    "rsa":{
        "public": Buffer.from(env.PUBLIC_KEY, 'hex').toString(),
        "private": Buffer.from(env.PRIVATE_KEY).toString()
    }
}

module.exports = jwt