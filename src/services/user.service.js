// Configs
const newUserConfig = require("../configs/user.config")
const jwtConfig = require("../configs/jwt.config")

// Modules
const ReturnMessage = require("../models/returnMessage.model")
const argon = require("argon2")

// Services
const dbService = require("./db.service")
const jwtService = require("./jwt.service")

async function usernameValidate(username){
    var regex = /^[a-zA-Z0-9]+$/;
    return regex.test(username);
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

module.exports = { getIdByUsername, getIdByEmail, create, hashPass, login, valEmail, usernameValidate, verifyPass }
