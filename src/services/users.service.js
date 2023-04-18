// Configs
const jwtConfig = require("../configs/jwt.config")
const fs = require("fs")
const emailConfig = require("../configs/email.config")

// Modules
const ReturnMessage = require("../models/returnMessage.model")
const argon = require("argon2")
const crypto = require("crypto")
const nodemailer = require("nodemailer")
const userModel = require("../models/user.model")

// Services
const dbService = require("./db.service")
const jwtService = require("./jwt.service")
const cacheService = require("./cache.service")

// Work
let emailVerificationHtml = fs.readFileSync("views/emailVerification.ejs").toString('utf-8');
emailVerificationHtml = emailVerificationHtml.replaceAll("%%SUPPORTEMAIL%%", `${emailConfig.supportEmail}`)

let resetPasswordEmail = fs.readFileSync("views/resetPasswordEmail.ejs").toString('utf-8');
resetPasswordEmail = resetPasswordEmail.replaceAll("%%SUPPORTEMAIL%%", `${emailConfig.supportEmail}`)

async function usernameValidate(username) {
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
}

async function get(userid) {
    let cache = cacheService.getCache("user", userid)
    if (cache != false) {
        return cache;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("600", "General Failure", 500, "error")
    }

    let sql = "SELECT * FROM users WHERE id LIKE ?"
    let inserts = [userid];
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]
        if (res.length == 0) {
            return new ReturnMessage("602", "User does not exist", 400, "error")
        }

        db.end()
        let ret = res[0];
        let user = new userModel(ret.id, ret.created, ret.username, ret.password, ret.email, ret.emailverified, ret.suspended, ret.verified, ret.dob)

        cacheService.setCache("user", userid, user)
        return user;
    } catch (err) {
        console.log(err);
        return new ReturnMessage("601", "General Failure", 500, "error")
    }
}

async function getIdByUsername(username) {
    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("200", "General Failure", 500, "error")
    }

    let sql = "SELECT * FROM users WHERE username LIKE ?"
    let inserts = [username];
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]
        if (res.length == 0) {
            return new ReturnMessage("202", "User does not exist", 400, "error")
        }

        db.end()
        return res[0].id;
    } catch (err) {
        console.log(err);
        return new ReturnMessage("201", "General Failure", 500, "error")
    }
}

async function getIdByEmail(email) {
    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("300", "General Failure", 500, "error")
    }

    let emailVerRequired = 1
    let sql = "SELECT * FROM users WHERE email LIKE ? AND emailverified LIKE ?"
    let inserts = [email, emailVerRequired];
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]
        if (res.length == 0) {
            return new ReturnMessage("302", "User does not exist", 400, "error")
        }

        db.end()
        return res[0].id;
    } catch (err) {
        console.log(err);
        return new ReturnMessage("301", "General Failure", 500, "error")
    }
}

async function hashPass(password) {
    return (await argon.hash(password, { secret: Buffer.from(jwtConfig.key) }));
}

async function verifyPass(hash, password) {
    try {
        return (await argon.verify(hash, password, { secret: Buffer.from(jwtConfig.key) }));
    } catch (err) {
        return false;
    }
}

function valEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

async function create(username, password, email, dob, response) {
    username = String(username);
    password = String(password);
    email = String(email);

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("103", "General Failure", 500, "error");
    }

    let sql = "INSERT INTO users (created, username, password, email, dob) VALUES (?,?,?,?,?)";
    let inserts = [Math.floor(Date.now() / 1000), username, (await hashPass(password)), email, dob]
    try {
        let res = (await db.execute(sql, inserts))
        let jwt = jwtService.genJWT({ 'sub': res[0].insertId });
        response.cookie("jwt", jwt, { maxAge: 86400000000, httpOnly: true, secure: true, sameSite: "Strict" })
        return new ReturnMessage(
            "107",
            {
                "message": "Account successfully created",
                "token": jwt
            },
            200,
            "userCreate"
        )
    } catch (err) {
        console.log(err);
        return new ReturnMessage("106", "General Failure", 500, "error")
    }
}

async function login(usernameOrEmail, password, response) {
    usernameOrEmail = String(usernameOrEmail);
    password = String(password);

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("401", "General Failure", 500, "error");
    }

    let emailVerRequired = 1;
    let sql = "SELECT * FROM users WHERE (username LIKE ?) OR (email LIKE ? AND emailverified LIKE ?)";
    let inserts = [usernameOrEmail, usernameOrEmail, emailVerRequired]
    try {
        let res = (await db.execute(sql, inserts))
        res = res[0]

        if (res.length == 0) {
            return new ReturnMessage("403", "Invalid Credentials", 400, "error");
        }

        try {
            if (!(await verifyPass(res[0].password, password))) {
                return new ReturnMessage("405", "Bad Password", 400, "error");
            }
        } catch (err) {
            console.log(err)
            return new ReturnMessage("406", "General Failure", 400, "error");
        }

        let jwt = jwtService.genJWT({ 'sub': res[0].id });
        response.cookie("jwt", jwt, { maxAge: 86400000000, httpOnly: true, secure: true, sameSite: "Strict" })
        return new ReturnMessage(
            "404",
            {
                "message": "Login Successful",
                "token": jwt
            },
            200,
            "userLogin"
        )
    } catch (err) {
        console.log(err);
        return new ReturnMessage("402", "General Failure", 500, "error")
    }
}

async function cancelVerificationEmails(userid) {
    let userData = get(userid);
    if (userData.constructor != undefined && userData.constructor.name == "ReturnMessage") {
        return userData;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("700", "General Failure", 500, "error");
    }

    let expiresTo = 0;
    let sql = "UPDATE emailverification SET expires = ? WHERE userid LIKE ?";
    let inserts = [expiresTo, userid];
    try {
        (await db.execute(sql, inserts));
        return true;
    } catch (err) {
        console.log(err);
        return new ReturnMessage("701", "General Failure", 500, "error")
    }
}

async function sendVerificationEmail(userid) {
    let userData = (await get(userid));
    if (userData.constructor != undefined && userData.constructor.name == "ReturnMessage") {
        return userData;
    }

    if (userData.emailverified == 1) {
        return new ReturnMessage("804", "Email already verified", 400, "error");
    }

    let emailAccount = emailConfig.accounts["no-reply@youcc.xyz"]

    let transport = nodemailer.createTransport({
        "auth": emailAccount.auth,
        "host": emailAccount.host,
        "port": emailAccount.port,
        "secure": emailConfig.secure,
        "tls": {
            "rejectUnauthorized": false
        },
        "connectionTimeout": emailConfig.connectionTimeout
    });

    let emailCancel = cancelVerificationEmails(userid)
    if (emailCancel.constructor != undefined && emailCancel.constructor.name == "ReturnMessage") {
        return emailCancel;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("800", "General Failure", 500, "error");
    }

    let token = crypto.randomBytes(128).toString('hex');
    let email = userData.email;
    let created = Math.floor(Date.now() / 1000)
    let expires = created + 1800; // 30 Minutes

    let emailVerHtml = emailVerificationHtml
    emailVerHtml = emailVerHtml.replaceAll("%%REPLACEME%%", `${emailConfig.verificationUrl}${token}`)

    transport.sendMail({
        "from": "no-reply@youcc.xyz",
        "to": email,
        "subject": "Verify your email",
        "html": emailVerHtml
    }, (err) => {
        if (err) {
            console.log("EMAIL ERROR:")
            console.log(err)
        }
    });

    let sql = "INSERT INTO emailverification (created, expires, token, email, userid) VALUES (?,?,?,?,?)";
    let inserts = [created, expires, token, email, userid];
    console.log(inserts)
    try {
        (await db.execute(sql, inserts));
        return new ReturnMessage("802", "Verification email sent", 200, "emailVerificationSend");
    } catch (err) {
        console.log(err)
        return new ReturnMessage("801", "General Failure", 500, "error")
    }
}

async function verifyEmail(token, userid) {
    let userData = (await get(userid));
    if (userData.constructor != undefined && userData.constructor.name == "ReturnMessage") {
        return userData;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("900", "General Failure", 500, "error");
    }

    let versKnownSql = "SELECT * FROM emailverification WHERE userid LIKE ? AND token LIKE ?";
    let versKnownInserts = [userid, token];
    try {
        let versKnown = (await db.execute(versKnownSql, versKnownInserts));
        if (versKnown[0].length == 0) {
            return new ReturnMessage("902", "Invalid Token", 400, "error");
        }

        let ver = versKnown[0][0];
        if (ver.expires < Math.floor(Date.now() / 1000)) {
            return new ReturnMessage("903", "Token Expired", 400, "error");
        }

        if (userData.email != ver.email) {
            return new ReturnMessage("904", "Email Mismatch", 400, "error");
        }

        let cancel = cancelVerificationEmails(userid)
        if (cancel.constructor != undefined && cancel.constructor.name == "ReturnMessage") {
            return cancel;
        }

        let emailVer = 1;
        let verifySql = "UPDATE users SET emailverified = ? WHERE id LIKE ?";
        let verifyInserts = [emailVer, userid];
        try {
            (await db.execute(verifySql, verifyInserts))
            return new ReturnMessage("906", "Email verified successfully", 500, "error");
        } catch (err) {
            console.log(err)
            return new ReturnMessage("905", "General Failure", 500, "error");
        }
    } catch (err) {
        return new ReturnMessage("901", "General Failure", 500, "error");
    }
}

function minAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    if (birthDate == "Invalid Date") return -1;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the user's birth month and day have not happened yet this year
    // and they haven't turned the minimum age yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 13) {
        return false;
    }

    return Math.floor(birthDate.getTime() / 1000);
}

async function sendResetEmail(usernameOrEmail) {
    usernameOrEmail = String(usernameOrEmail);
    console.log(usernameOrEmail)

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1700", "General Failure", 500, "error");
    }

    let mustVerify = 1;
    let sql = "SELECT * FROM users WHERE (username LIKE ? OR email LIKE ?) AND emailverified LIKE ?";
    let inserts = [usernameOrEmail, usernameOrEmail, mustVerify];
    try {
        let res = (await db.execute(sql, inserts));
        res = res[0]
        if (res == undefined || res.length == 0){
            console.log("no content")
            return;
        } 

        let emailAccount = emailConfig.accounts["no-reply@youcc.xyz"]

        let transport = nodemailer.createTransport({
            "auth": emailAccount.auth,
            "host": emailAccount.host,
            "port": emailAccount.port,
            "secure": emailConfig.secure,
            "tls": {
                "rejectUnauthorized": false
            },
            "connectionTimeout": emailConfig.connectionTimeout
        });

        let token = crypto.randomBytes(128).toString('hex');
        let email = res[0].email;
        let created = Math.floor(Date.now() / 1000)
        let expires = created + 600; // 10 Minutes
        let userid = res[0].id

        let resetPassHtml = resetPasswordEmail
        resetPassHtml = resetPassHtml.replaceAll("%%REPLACEME%%", `${emailConfig.resetPasswordUrl}${token}`)

        sql = "INSERT INTO reset (created, expires, token, userid) VALUES (?,?,?,?)"
        inserts = [created, expires, token, userid]
        try {
            (await db.execute(sql, inserts))
        } catch(err){
            console.log(err)
            return
        }

        transport.sendMail({
            "from": "no-reply@youcc.xyz",
            "to": email,
            "subject": "Reset password",
            "html": resetPassHtml
        }, (err) => {
            if (err) {
                console.log("EMAIL ERROR:")
                console.log(err)
            }
        });


        console.log({
            "from": "no-reply@youcc.xyz",
            "to": email,
            "subject": "Reset password",
            "html": resetPassHtml
        })
        console.log("reset done")



    } catch (err) {
        console.log(err)
        return
    }
}

async function setPassword(userid, newPassword){
    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1711", "General Failure", 500, "error");
    }

    newPassword = (await hashPass(newPassword))

    let sql = "UPDATE users SET password = ? WHERE id LIKE ?";
    let inserts = [newPassword, userid]
    try {
        (await db.execute(sql, inserts))
        return true;
    } catch(err){
        console.log(err)
        return new ReturnMessage("1712", "General Failure", 500, "error");
    }
}

async function resetPassword(tokenOrCurrentPassword, newPassword, req){
    let login = jwtService.isLoggedIn(req)

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("1704", "General Failure", 500, "error");
    }

    if(login != false){
        let userData = (await get(login.sub))
        if (userData.constructor != undefined && userData.constructor.name == "ReturnMessage") {
            return userData;
        }
        if(verifyPass(userData.password, tokenOrCurrentPassword) == false)return new ReturnMessage("1706", "Bad Password", 400, 'error')
        let setPass = (await setPassword(userData.id, newPassword))
        if(setPass !== true)return setPass;
        return new ReturnMessage("1707", "Password reset successfully", 200, 'resetPassword')
    }

    let sql = "SELECT * FROM reset WHERE token LIKE ?";
    let inserts = [tokenOrCurrentPassword];

    try {
        let tokenResults = (await db.execute(sql, inserts));
        tokenResults = tokenResults[0]

        if(tokenResults.length == 0){
            return new ReturnMessage("1708", "Bad token", 400, 'error')
        } 

        let tokenData = tokenResults[0]
        if(tokenData.expires < Math.floor(Date.now() / 1000)){
            return new ReturnMessage("1709", "Expired token", 400, 'error')
        }

        let userData = (await get(tokenData.userid))
        if (userData.constructor != undefined && userData.constructor.name == "ReturnMessage") {
            return userData;
        }

        let set = (await setPassword(tokenData.userid, newPassword))
        if(set !== true)return set;

        let newExp = Math.floor(Date.now() / 1000)
        let tokenId = tokenData.id
        sql = "UPDATE reset SET expires = ? WHERE id LIKE ?"
        inserts = [newExp, tokenId];
        try {
            (await db.execute(sql, inserts))
        } catch(err){
            console.log(err)
        }

        return new ReturnMessage("1710", "Password reset through token successfully", 200, 'resetPassword')

    } catch(err){
        console.log(err)
        return new ReturnMessage("1705", "General Failure", 500, "error");
    }
}

module.exports = { getIdByUsername, getIdByEmail, create, hashPass, login, valEmail, usernameValidate, verifyPass, sendVerificationEmail, get, verifyEmail, minAge, sendResetEmail, resetPassword }
