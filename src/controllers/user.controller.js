// Configs
const userConfig = require("../configs/user.config");

// Services
const jwtService = require("../services/jwt.service");
const userService = require("../services/users.service");

// Modules
const htmlED = require("html-encoder-decoder")

// Models
const ReturnMessage = require("../models/returnMessage.model");

async function create(username, password, email, req, response){
    username = String(username);
    password = String(password);
    email = String(email);

    username = htmlED.encode(username)

    if(!(await userService.usernameValidate(username))){
        return new ReturnMessage("109", "Invalid Username", 400, "error");
    }

    if (jwtService.isLoggedIn(req)) {
        return new ReturnMessage("104", "Cannot create an account while logged in", 400, "error");
    }

    if (!userService.valEmail(email)) {
        return new ReturnMessage("105", "Email is invalid", 400, "error")
    }

    if (username.length < userConfig.minUsernameLength || username.length > userConfig.maxUsernameLength) {
        return new ReturnMessage("100", `Username must be between ${userConfig.minUsernameLength} and ${userConfig.maxUsernameLength} characters`, 400, "error");
    }

    if (password.length < userConfig.minPasswordLength || password.length > userConfig.maxPasswordLength) {
        return new ReturnMessage("101", `Password must be between ${userConfig.minPasswordLength} and ${userConfig.maxPasswordLength} characters`, 400, "error");
    }

    let userExistence = await userService.getIdByUsername(username)
    if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code != "202") {
        return userExistence;
    }

    if (userExistence.constructor != undefined && userExistence.constructor.name == "ReturnMessage" && userExistence.code == "202") {

    } else {
        return new ReturnMessage("102", "Username already taken", 400, "error");
    }

    let emailExistence = await userService.getIdByEmail(email);
    if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code != "302") {
        return emailExistence;
    }

    if (emailExistence.constructor != undefined && emailExistence.constructor.name == "ReturnMessage" && emailExistence.code == "302") {

    } else {
        return new ReturnMessage("108", "Email already taken", 400, "error");
    }

    return userService.create(username, password, email, response)
}

async function login(usernameOrEmail, password, req, response){
    if (jwtService.isLoggedIn(req)) {
        return new ReturnMessage("400", "Already logged in", 400, "error");
    }

    return userService.login(usernameOrEmail, password, response)
}

async function sendVerificationEmail(req){
    let login = jwtService.isLoggedIn(req)
    if(!login) {
        return new ReturnMessage("803", "Must be logged in to send a verification email", 400, "error");
    }

    return userService.sendVerificationEmail(login.sub)
}

async function verifyEmail(token, req){
    let login = jwtService.isLoggedIn(req)
    if(!login) {
        return new ReturnMessage("907", "Must be logged in to verify an email", 400, "error");
    }

    return userService.verifyEmail(token, login.sub)
}

async function get(userid, req){
    let isSelf = false;
    let login = jwtService.isLoggedIn(req)
    if(login != false && login.sub == userid) {
        isSelf = true;
    }

    let userData = (await userService.get(userid))
    if(userData.constructor != undefined && userData.constructor.name == "ReturnMessage"){
        return userData;
    }

    let ret = {}

    ret.id = userData.id
    ret.created = userData.created
    ret.username = userData.username
    ret.suspended = userData.suspended
    ret.verified = userData.verified
    if(isSelf){
        ret.email = userData.email
        ret.emailverified = userData.emailverified
    }

    return new ReturnMessage("1000", ret, 200, "userGet")
}

module.exports = { create, login, sendVerificationEmail, verifyEmail, get }