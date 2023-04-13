
let jwt = {
    "issuer":"chatbox",
    "algorithm":"HS256",
    "expiresin": 15780000,
    "key":process.env.PRIVATE_KEY || "secret",
    "passAlgorithm":"sha256"
}

module.exports = jwt