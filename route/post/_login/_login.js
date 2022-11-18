const responser = require("../../../helper/responser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = function(msg) {
    const loginPagePath = process.cwd() + "/route/get/_login/_login.html"
    if(!msg.payload.username || !msg.payload.password) {
        msg.error = {
            message: "Kullanıcı adı ve parola doldurulmalıdır."
        }
        responser({ msg, filePath: loginPagePath, extension: ".html", staticPath: msg.static })
        return
    }

    msg.user = DB.getCollection("user").find(u => u.username === msg.payload.username)

    if(!msg.user) {
        msg.error = {
            message: "Kullanıcı adı ve parola hatalı."
        }
        responser({ msg, filePath: loginPagePath, extension: ".html", staticPath: msg.static })
        return
    }

    bcrypt.compare(msg.payload.password, msg.user.password, function(err, result) {
        if(!result) {
            msg.error = {
                message: "Kullanıcı adı ve parola hatalı."
            }
            responser({ msg, filePath: loginPagePath, extension: ".html", staticPath: msg.static })
            return
        }

        jwt.sign({
            username: msg.user.username,
            email: msg.user.email,
            displayName: msg.user.displayName,
            roles: msg.user.roles,
            ip: msg.req.ip
        }, process.env.JWTSECRET, { expiresIn: 86400 /* One Day */ }, function(err, token) {
            if(err) throw new Error(err)
    
            msg.res.setHeader("Set-Cookie", ["token=" + token])
            msg.res.writeHead(302, { "Location": "/" })
            msg.res.end()
        });
    });
}