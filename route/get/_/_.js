const responser = require("../../../helper/responser")
const checkUser = require("../../../helper/check_user")
const cookieParser = require("../../../helper/cookie_parser")

module.exports = function(msg) {
    const res = msg.res

    if(!res) throw new Error("Response objesi bulunamadı.")

    let cookies = cookieParser(msg.req.headers.cookie)

    msg.token = cookies.token

    checkUser(msg).then((user) => {
        msg.payload = DB.getCollection("todo").filter(x => x.stamp.username === user.username || user.roles.includes("admin")).sort((a, b) => b.stamp.createdAt - a.stamp.createdAt)
        msg.hasAdmin = user.roles.includes("admin")
        msg.user = user

        responser({ msg, filePath: msg.filePath.slice(0, -2) + "html", extension: ".html", staticPath: msg.static })
    }).catch((err) => {
        res.writeHead(302, { "Location": "/login" })
        res.end()
    })

}