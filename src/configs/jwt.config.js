
let jwt = {
    "issuer":"chatboxmini",
    "algorithm":"HS256",
    "expiresin": 15780000,
    "key":process.env.PRIVATE_KEY || "secret123",
    "passAlgorithm":"sha256"
}

module.exports = jwt