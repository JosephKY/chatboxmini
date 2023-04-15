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

async function usernameValidate(username){
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
}

async function get(userid){
    let cache = cacheService.getCache("user", userid)
    if(cache != false){
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

async function verifyPass(hash, password){
    try{
        return (await argon.verify(hash, password, { secret: Buffer.from(jwtConfig.key) }));
    } catch(err){
        console.log(err)
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

async function create(username, password, email, response) {
    username = String(username);
    password = String(password);
    email = String(email);

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("103", "General Failure", 500, "error");
    }

    let sql = "INSERT INTO users (created, username, password, email) VALUES (?,?,?,?)";
    let inserts = [Math.floor(Date.now() / 1000), username, (await hashPass(password)), email]
    try {
        let res = (await db.execute(sql, inserts))
        let jwt = jwtService.genJWT({ 'sub': res[0].insertId });
        response.cookie("jwt", jwt, { maxAge: 86400000000, httpOnly: true, secure: true })
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
        
        if(res.length == 0){
            return new ReturnMessage("403", "Invalid Credentials", 400, "error");
        }

        try {
            if(!verifyPass(res[0].password, password)){
                return new ReturnMessage("405", "Bad Password", 400, "error");
            }
        }catch(err){
            console.log(err)
            return new ReturnMessage("406", "General Failure", 400, "error");
        }

        let jwt = jwtService.genJWT({ 'sub': res[0].id });
        response.cookie("jwt", jwt, { maxAge: 86400000000, httpOnly: true, secure: true })
        return new ReturnMessage(
            "404",
            {
                "message": "Login Successful",
                "token": jwt
            },
            200,
            "userLogin"
        )
    }catch(err){
        console.log(err);
        return new ReturnMessage("402", "General Failure", 500, "error")
    }
}

async function cancelVerificationEmails(userid){
    let userData = get(userid);
    if(userData.constructor != undefined && userData.constructor.name == "ReturnMessage"){
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
    } catch(err){
        console.log(err);
        return new ReturnMessage("701", "General Failure", 500, "error")
    }
}

async function sendVerificationEmail(userid){
    let userData = (await get(userid));
    if(userData.constructor != undefined && userData.constructor.name == "ReturnMessage"){
        return userData;
    }

    if(userData.emailverified == 1){
        return new ReturnMessage("804", "Email already verified", 400, "error");
    }

    let emailAccount = emailConfig.accounts["no-reply@youcc.xyz"]

    let transport = nodemailer.createTransport({
        "auth":emailAccount.auth,
        "host":emailAccount.host,
        "port":emailAccount.port,
        "secure":emailConfig.secure,
        "tls":{
            "rejectUnauthorized":false
        },
        "connectionTimeout":emailConfig.connectionTimeout
    });

    let emailCancel = cancelVerificationEmails(userid)
    if(emailCancel.constructor != undefined && emailCancel.constructor.name == "ReturnMessage"){
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
        "from":"no-reply@youcc.xyz",
        "to":"josephshackleford04@gmail.com",
        "subject":"Verify your email",
        "html":emailVerHtml
    }, (err)=>{
        if(err){
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
    } catch(err) {
        console.log(err)
        return new ReturnMessage("801", "General Failure", 500, "error")
    }
}

async function verifyEmail(token, userid){
    let userData = (await get(userid));
    if(userData.constructor != undefined && userData.constructor.name == "ReturnMessage"){
        return userData;
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("900", "General Failure", 500, "error");
    }

    let versKnownSql = "SELECT * FROM emailverification WHERE userid LIKE ? AND token LIKE ?";
    let versKnownInserts = [userid, token];
    try{
        let versKnown = (await db.execute(versKnownSql, versKnownInserts));
        if(versKnown[0].length == 0){
            return new ReturnMessage("902", "Invalid Token", 400, "error");
        }

        let ver = versKnown[0][0];
        if(ver.expires < Math.floor(Date.now() / 1000)){
            return new ReturnMessage("903", "Token Expired", 400, "error");
        }

        if(userData.email != ver.email){
            return new ReturnMessage("904", "Email Mismatch", 400, "error");
        }

        let cancel = cancelVerificationEmails(userid)
        if(cancel.constructor != undefined && cancel.constructor.name == "ReturnMessage"){
            return cancel;
        }

        let emailVer = 1;
        let verifySql = "UPDATE users SET emailverified = ? WHERE id LIKE ?";
        let verifyInserts = [emailVer, userid];
        try{
            (await db.execute(verifySql, verifyInserts))
            return new ReturnMessage("906", "Email verified successfully", 500, "error");
        } catch(err){
            console.log(err)
            return new ReturnMessage("905", "General Failure", 500, "error");
        }
    }catch(err){
        return new ReturnMessage("901", "General Failure", 500, "error");
    }
}

module.exports = { getIdByUsername, getIdByEmail, create, hashPass, login, valEmail, usernameValidate, verifyPass, sendVerificationEmail, get, verifyEmail }
