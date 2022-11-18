const fs = require("node:fs")
const path = require("node:path")
const mime = require("mime/lite")
const mustache = require("mustache")

const self = module.exports = function({ msg = {}, filePath = "/", statusCode = 200, extension = ".html", staticPath = "" }) {
    const res = msg.res
    if(!res) throw new Error("Response objesi bulunamadı.")

    if(!filePath.includes(staticPath)) require(filePath)({ staticPath, filePath, ...msg })
    else {
        fs.readFile(filePath, function(err, data) {
            if(err) {
                extension = ".html"
                filePath = path.join(process.cwd(), "status_template", `${statusCode}${extension}`)
                self({ msg, filePath, statusCode: 404, extension })
                return
            }
            res.writeHead(statusCode, { "Content-Type": mime.getType(extension) })

            try {
                res.end(mustache.render(data.toString(), msg))
            } catch(error) {
                res.end(data)
            }
        })
    }
}