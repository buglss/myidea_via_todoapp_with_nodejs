const responser = require("../../../helper/responser")
const checkUser = require("../../../helper/check_user")
const cookieParser = require("../../../helper/cookie_parser")

module.exports = function(msg) {
    const res = msg.res

    if(!res) throw new Error("Response objesi bulunamadı.")

    let cookies = cookieParser(msg.req.headers.cookie)

    msg.token = cookies.token

    checkUser(msg).then((user) => {
        const dataIndex = DB.getCollection("todo").findIndex(x => x.id == msg.payload.id && (x.stamp.username === user.username || user.roles.includes("admin")))

        if(!~dataIndex) throw new Error("İd ile eşleşen bir kayıt bulunamadı.")

        const typeLookup = require("../../../storage/type_lookup")
        
        const type = "complete"

        if(!Object.keys(typeLookup).includes(type)) throw new Error(`${type} geçersiz bir parametre değeridir.`)

        if(!typeLookup[type].requireArgs.every(arg => msg.payload[arg])) throw new Error(`${typeLookup[type].text} istediğiniz elemanın ${typeLookup[type].requireArgs} bilgisi(leri) olmalı.`)

        const date = new Date()
        const now = date.getTime()

        DB.getCollection("todo")[dataIndex] = {
            ...DB.getCollection("todo")[dataIndex],
            done: true,
            stamp: {
                createdAt: now,
                ip: msg.req.ip,
                username: user.username || "",
                email: user.email || ""
            },
            date: date.toLocaleDateString("TR"), // DD.AA.YYYY
            time: date.toLocaleTimeString("TR") // SS:DD:NN
        }

        res.writeHead(302, { "Location": "/" })
        res.end()
    }).catch((err) => {
        msg.error = {
            message: err
        }
        responser({ msg, filePath: process.cwd() + "/route/get/_/_.js", extension: ".js", staticPath: msg.static })
    })

}