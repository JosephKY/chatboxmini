// Modules
const express = require("express")
const cookies = require("cookie-parser")
const nodemailer = require("nodemailer")

// Work
const app = express()
const port = 3000
const defaultLocale = "en_us"

app.use(cookies());
app.set("view engine", "ejs");

app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use("/", (req, res)=>{
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

    let trans = nodemailer.createTransport("smtp://no-reply@youcc.xyz:ZDax0^IpOO$6!JJYug@youcc.xyz/?pool=true")

    let transport = nodemailer.createTransport({
        "auth":{
            "user":"no-reply@youcc.xyz",
            "pass":"ZDax0^IpOO$6!JJYug"
        },
        "host":"172.67.140.157",
        "port":"587",
        "secure":false,
    });

    trans.sendMail({
        "from":"no-reply@youcc.xyz",
        "to":"josephshackleford04@gmail.com",
        "subject":"test",
        "text":"Hello World!"
    },
    (err, info)=>{
        if(err){
            console.log(err)
        } else {
            console.log(info)
        }
    }
    )

    res.render("index", localeData)
})

app.listen(port, () => {
    console.log(`Chatbox Mini listening on port ${port}`)
})