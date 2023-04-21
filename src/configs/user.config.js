let userConfig = {
    minUsernameLength: 3,
    maxUsernameLength: 32,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    settings:[
        "changeUsername",
        "changePassword",
        "email"
    ],
    reservedUsernames:[
        "home",
        "settings",
        "explore",
        "search",
        "resetpassword",
        "login",
        "signout",
        "feed",
        "feedofficial",
        "feed_official",
        "feedoficial",
        "feed_oficial",
        "feed-official",
        "feed-oficial",
        "admin",
        "terms",
        "privacy",
        "guidelines",
        "support",
        "report"
    ]
};

module.exports = userConfig;