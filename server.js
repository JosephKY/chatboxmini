// Modules
const express = require("express")
const cookies = require("cookie-parser")
const nodemailer = require("nodemailer")
const SMTPConnection = require("nodemailer/lib/smtp-connection");
const fs = require("fs")

// Services
const restrictionsService = require("./src/services/restrictions.service")

// Routes
const apiRoute = require("./src/routes/api.route")

// Configs
const restrictionsConfig = require("./src/configs/restrictions.config")
const postConfig = require("./src/configs/post.config")

// Work
for(let name in restrictionsConfig){
    restrictionsService.addActivity(name)
    restrictionsConfig[name].forEach(r=>{
        restrictionsService.addRestriction(name, r[0], r[1])
    })
}

let blackbook = fs.readFileSync("src/configs/blackbook.txt")
blackbook.toString().replaceAll("\r", "").split("\n").forEach(b=>{
    postConfig.bannedDomains.push(b)
})

const app = express()
const port = 3000
const defaultLocale = "en_us"

app.use(cookies());
app.set("view engine", "ejs");

app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use("/api", apiRoute)

app.use("/", async (req, res)=>{
    let locale = defaultLocale
    if(!req.cookies || !req.cookies.locale){
        locale = defaultLocale
        res.cookie("locale", defaultLocale, { maxAge: 86400000000 })
    } 
    locale = req.cookies.locale

    let localeData = require(`./src/locale/${defaultLocale}.locale.js`);
    try {
        localeData = require(`./src/locale/${locale}.locale.js`);
    } catch(e){
        localeData = require(`./src/locale/${defaultLocale}.locale.js`);
    }
    
    res.render("index", localeData)
})



app.listen(port, () => {
    console.log(`Chatbox Mini listening on port ${port}`)
})