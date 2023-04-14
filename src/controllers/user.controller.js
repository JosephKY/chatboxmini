// Configs
const userConfig = require("../configs/user.config");

// Services
const jwtService = require("../services/jwt.service");
const userService = require("../services/user.service");

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

module.exports = { create, login }