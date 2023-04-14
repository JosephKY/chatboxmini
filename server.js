// Modules
const express = require("express")
const cookies = require("cookie-parser")
const nodemailer = require("nodemailer")
const SMTPConnection = require("nodemailer/lib/smtp-connection");

// Services
const userService = require("./src/services/user.service")

// Routes
const userRoute = require("./src/routes/user.route")

// Work
const app = express()
const port = 3000
const defaultLocale = "en_us"

app.use(cookies());
app.set("view engine", "ejs");

app.use(express.static('public', {
    extensions: ['html', 'htm'],
}));

app.use("/users", userRoute)

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

    /*
    
    let trans = nodemailer.createTransport("smtp://no-reply@youcc.xyz:ZDax0^IpOO$6!JJYug@youcc.xyz/?pool=true")

    let transport = nodemailer.createTransport({
        "auth":{
            "user":"no-reply@youcc.xyz",
            "pass":"ZDax0^IpOO$6!JJYug"
        },
        "host":"82.163.176.90",
        "tls":{
            "rejectUnauthorized":false
        },
        "secure":true,
        connectionTimeout:5000
    });

    let errcount = 0

    transport.sendMail({
        "from":"no-reply@youcc.xyz",
        "to":"josephshackleford04@gmail.com",
        "subject":"test",
        "text":"Hello World!"
    },

    (err, info)=>{
        if(err){
            console.log(err)
            console.log(`YOU F'D UP ${errcount}`)
            errcount = errcount + 1
        } else {
            console.log(info)
            console.log("SUCCESS!")
        }
    }
    )
    */

    /*
    let conn = new SMTPConnection({
        port:"465",
        host:"youcc.xyz", 
        secure:true,
        connectionTimeout:5000,
        debug:true
    }).connect((err)=>{
        if(err){
            console.log("error:")
            console.log(err)
        }
        
    })
    
    conn.login({
        user:"no-reply@youcc.xyz",
        pass:"ZDax0^IpOO$6!JJYug",
    })
    */

    /*
    const { SMTPClient } = require("smtp-client")

    let s = new SMTPClient({
        host: 'youcc.xyz',
        port: 465
    });

    (async function() {
        await s.connect();
        await s.greet({hostname: 'youcc.xyz'}); // runs EHLO command or HELO as a fallback
        await s.authPlain({username: 'no-reply@youcc.xyz', password: 'ZDax0^IpOO$6!JJYug'}); // authenticates a user
        await s.mail({from: 'no-reply@youcc.xyz'}); // runs MAIL FROM command
        await s.rcpt({to: 'josephshackleford04@gmail.com'}); // runs RCPT TO command (run this   multiple times to add more recii)
        await s.data('hello world'); // runs DATA command and streams email source
        await s.quit(); // runs QUIT command
    })().catch(console.log("error"));
    */
    res.render("index", localeData)
})



app.listen(port, () => {
    console.log(`Chatbox Mini listening on port ${port}`)
})