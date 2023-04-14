let email = {
    "connectionTimeout":5000,
    "secure":true,
    "verificationUrl":"http://localhost:3000/users/verify?token=",
    "accounts": {
        "no-reply@youcc.xyz": {
            "host": "82.163.176.90",
            "port": 465,
            "auth": {
                "user": "no-reply@youcc.xyz",
                "pass": "ZDax0^IpOO$6!JJYug"
            }
        }
    }
};

module.exports = email;