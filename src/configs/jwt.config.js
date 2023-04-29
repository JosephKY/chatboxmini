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
        "public": atob(env.PUBLIC_KEY),
        "private": atob(env.PRIVATE_KEY)
    }
}

module.exports = jwt