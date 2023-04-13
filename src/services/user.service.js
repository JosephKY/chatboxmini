// Configs
const newUserConfig = require("../configs/newuser.config")
const jwtConfig = require("../configs/jwt.config")

// Modules
const ReturnMessage = require("../models/returnMessage.model")
const crypto = require("crypto")

// Services
const dbService = require("./db.service")
const jwtService = require("./jwt.service")

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

function hashPass(password) {
    return crypto.pbkdf2Sync(password, jwtConfig.key, 1000, 64, 'sha512').toString("hex");
}

function valEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

async function create(username, password, email, req, response) {
    username = String(username);
    password = String(password);

    if (jwtService.isLoggedIn(req)) {
        return new ReturnMessage("104", "Cannot create an account while logged in", 400, "error");
    }

    if (!valEmail(email)) {
        return new ReturnMessage("105", "Email is invalid", 400, "error")
    }

    if (username.length < newUserConfig.minUsernameLength || username.length > newUserConfig.maxUsernameLength) {
        return new ReturnMessage("100", `Username must be between ${newUserConfig.minUsernameLength} and ${newUserConfig.maxUsernameLength} characters`, 400, "error");
    }

    if (password.length < newUserConfig.minPasswordLength || password.length > newUserConfig.maxPasswordLength) {
        return new ReturnMessage("101", `Password must be between ${newUserConfig.minPasswordLength} and ${newUserConfig.maxPasswordLength} characters`, 400, "error");
    }

    let userExistence = await getIdByUsername(username)
    if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code != "202") {
        return userExistence;
    }

    if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code == "202") {

    } else {
        return new ReturnMessage("102", "Username already taken", 400, "error");
    }

    let emailExistence = await getIdByEmail(email);
    if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code != "302") {
        return emailExistence;
    }

    if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code == "302") {

    } else {
        return new ReturnMessage("108", "Email already taken", 400, "error");
    }

    let db = await dbService.newdb()
    if (!db) {
        return new ReturnMessage("103", "General Failure", 500, "error");
    }

    let sql = "INSERT INTO users (created, username, password, email) VALUES (?,?,?,?)";
    let inserts = [Math.floor(Date.now() / 1000), username, hashPass(password), email]
    try {
        let res = (await db.execute(sql, inserts))
        let jwt = jwtService.genJWT({ 'sub': res[0].insertId });
        response.cookie("jwt", jwt, { maxAge: 86400000000 })
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

async function login(username, email, password, req, response) {
    if (jwtService.isLoggedIn(req)) {
        return new ReturnMessage("402", "Already logged in", 400, "error");
    }

    let passHash = hashPass(password);

    if (username != undefined) {
        let userExistence = await getIdByUsername(username)
        if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code != "202") {
            return userExistence;
        }

        if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code == "202") {
            return new ReturnMessage("400", "User does not exist", 400, "error");
        }

        let db = dbService.newdb
        if(!db){
            return new ReturnMessage("404", "General Failure", 500, "error");
        }

        try{

        }catch(err){
            console.log(err);
            return new ReturnMessage("405", "General Failure", 500, "error");
        }

    } else if (email != undefined) {
        let emailExistence = await getIdByEmail(email);
        if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code != "302") {
            return emailExistence;
        }

        if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code == "302") {

        } else {
            return new ReturnMessage("403", "User does not exist", 400, "error");
        }


    } else {
        return new ReturnMessage("401", "Supply either a username or an email")
    }
}

module.exports = { getIdByUsername, getIdByEmail, create, hashPass, login }
