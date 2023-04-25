// Configs
const userConfig = require("../configs/user.config");

// Services
const jwtService = require("../services/jwt.service");
const userService = require("../services/users.service");

// Modules
const htmlED = require("html-encoder-decoder")

// Models
const ReturnMessage = require("../models/returnMessage.model");
const { delCache } = require("../services/cache.service");

async function create(username, password, email, dob, req, response){
    username = String(username);
    password = String(password);
    email = String(email);
    
    let verAge = userService.minAge(dob)
    if(verAge == -1){
        return new ReturnMessage("120", "Age could not be verified", 400, "error");
    }

    if(verAge == -2){
        return new ReturnMessage("140", "Date of birth year must be at least 1917", 400, "error");
    }

    if(verAge == false){
        return new ReturnMessage("121", "Must be 13 or older to create an account", 400, "error");
    }

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

    return userService.create(username, password, email, verAge, response)
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
    let login = jwtService.isLoggedIn(req)

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
    ret.actions = []
    if(login != false && (login.sub == userData.id || userService.admin(login.sub))){
        ret.email = userData.email
        ret.emailverified = userData.emailverified
        ret.dob = userData.dob
    } 
    
    if(login != false && login.sub != userData.id){
        ret.actions.push("report")
    }

    return new ReturnMessage("1000", ret, 200, "userGet")
}

async function me(req){
    let login = jwtService.isLoggedIn(req)
    if(!login){
        return new ReturnMessage(
            "1500",
            null,
            200,
            'me'
        )
    }

    return get(login.sub, req);
}

async function usernameTaken(username){
    username = String(username)
    if(!(await userService.usernameValidate(username)) || username.length < userConfig.minUsernameLength || username.length > userConfig.maxUsernameLength){
        return new ReturnMessage(
            "1603",
            -1,
            200,
            "usernameTaken"
        )
    }

    let user = (await userService.getIdByUsername(username))
    if(user.constructor != undefined && user.constructor.name == "ReturnMessage"){
        if(user.code == "202"){
        return new ReturnMessage(
            "1601",
            false,
            200,
            "usernameTaken"
        )
        } else {
            return user;
        }
    } else {
        return new ReturnMessage(
            "1602",
            true,
            200,
            "usernameTaken"
        )
    }
}

async function sendResetEmail(usernameOrEmail, req){
    let login = (jwtService.isLoggedIn(req));
    if(login != false)return new ReturnMessage("1702", "Cannot reset a password while logged in", 400, 'error')

    console.log(await userService.sendResetEmail(usernameOrEmail));
    return new ReturnMessage("1701", "If an account by the provided username/email exists, and the account's email is verified, a password reset email should be sent", 200, 'resetPassword');
}

async function resetPassword(tokenOrCurrentPassword, newPassword, req){
    newPassword = String(newPassword)

    if (newPassword.length < userConfig.minPasswordLength || newPassword.length > userConfig.maxPasswordLength) {
        return new ReturnMessage("1730", `Password must be between ${userConfig.minPasswordLength} and ${userConfig.maxPasswordLength} characters`, 400, "error");
    }

    return (await userService.resetPassword(tokenOrCurrentPassword, newPassword, req));
}

async function changeUsername(newUsername, req){
    let login = (jwtService.isLoggedIn(req));
    if(login == false)return new ReturnMessage("2002", "Login required", 400, 'error')

    let taken = (await usernameTaken(newUsername))
    if(taken.data !== false){
        console.log(taken)
        return new ReturnMessage("2003", "Username is taken or invalid", 400, 'error')
    }

    let change = (await userService.changeUsername(login.sub, htmlED.encode(newUsername)))
    if(change !== true){
        return change;
    }

    return new ReturnMessage("2005", "Username changed successfully", 200, 'usernameChange')
}

async function changeEmail(newEmail, currentPassword, req){
    let login = (jwtService.isLoggedIn(req));
    if(login == false)return new ReturnMessage("2300", "Login required", 400, 'error')
    if(!userService.valEmail(newEmail))return new ReturnMessage("2301", "Email is invalid", 400, 'error')

    let myData = (await userService.get(login.sub))
    if(myData.constructor != undefined && myData.constructor.name == 'ReturnMessage')return myData;
    if (!(await userService.verifyPass(myData.pass, currentPassword))) {
        return new ReturnMessage("2306", "Bad Password", 400, "error");
    }

    if(myData.email == newEmail){
        return new ReturnMessage("2307", "New email cannot be the same as your current one", 400, "error");
    }

    let ex = (await userService.getIdByEmail(newEmail))
    if(ex.constructor != undefined && ex.constructor.name == 'ReturnMessage'){
        if(ex.code == "302"){
            let change = (await userService.changeEmail(newEmail, login.sub))
            if(change !== true){
                return change
            }
            return new ReturnMessage("2304", "Email changed successfully", 200, 'changeEmail')
        } else {
            return ex;
        }
    } else {
        if(login.sub == ex){
            return new ReturnMessage("2303", "Email is already associated with your account", 400, 'error')
        }
        return new ReturnMessage("2302", "Email is already associated with another account", 400, 'error')
    }
    
}

async function deleteUser(req, res, currentPassword){
    let login = (jwtService.isLoggedIn(req));
    if(login == false)return new ReturnMessage("2503", "Login required", 400, 'error')

    let myData = (await userService.get(login.sub))
    if(myData.constructor != undefined && myData.constructor.name == 'ReturnMessage')return myData;
    if (!(await userService.verifyPass(myData.pass, currentPassword))) {
        return new ReturnMessage("2504", "Bad Password", 400, "error");
    }

    res.cookie("jwt", "", { maxAge: 0 })
    let del = (await userService.deleteUser(login.sub))
    if(del != true)return del
    return new ReturnMessage("2505", "Account deleted successfully", 200, 'userDelete')
}

module.exports = { create, login, sendVerificationEmail, verifyEmail, get, me, usernameTaken, sendResetEmail, resetPassword, changeUsername, changeEmail, deleteUser }