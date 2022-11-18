const responser = require("../../../helper/responser")
const fs = require("node:fs")

module.exports = function(msg) {
    fs.readFile(msg.filePath.slice(0, -2) + "css", function(err, data) {
        msg.css = data.toString()
        responser({ msg, filePath: msg.filePath.slice(0, -2) + "html", extension: ".html", staticPath: msg.static })
    })
}