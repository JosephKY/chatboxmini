let restrictions = {
    "api":[
        
    ],
    "userGet":[
        
    ],
    "sendVerificationEmail":[
        [300, 1],
        [10800, 5],
        [86400, 10],
        [(2628000 * 3), 30]
    ],
}

// [lengthInSeconds, maxRequests]

module.exports = restrictions