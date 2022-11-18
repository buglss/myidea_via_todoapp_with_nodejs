const responser = require("../../../helper/responser")
const checkUser = require("../../../helper/check_user")
const cookieParser = require("../../../helper/cookie_parser")

module.exports = function(msg) {
    const res = msg.res

    if(!res) throw new Error("Response objesi bulunamadı.")

    let cookies = cookieParser(msg.req.headers.cookie)

    msg.token = cookies.token

    checkUser(msg).then((user) => {
        msg.payload = DB.getCollection("todo").find(x => x.id == msg.payload.id && (x.stamp.username === user.username || user.roles.includes("admin")))

        if(!msg.payload) throw new Error("İd ile eşleşen bir kayıt bulunamadı.")
        if(msg.payload.done) throw new Error("Tamamlanan işler güncellenemez.")

        responser({ msg, filePath: msg.filePath.slice(0, -2) + "html", extension: ".html", staticPath: msg.static })
    }).catch((err) => {
        msg.error = {
            message: err
        }
        responser({ msg, filePath: process.cwd() + "/route/get/_/_.js", extension: ".js", staticPath: msg.static })
    })

}