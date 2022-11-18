const url = require("node:url")
const path = require("node:path")
const { parse } = require("node:querystring")
const responser = require("./responser")

const self = module.exports = {
    static: "",
    serve(req, res) {
        let chunks = []
        let msg = {}
        req.on("data", (chunk) => chunks.push(chunk))
        req.on("end", () => {
            let body = Buffer.concat(chunks).toString()
            let parsedUrl = url.parse(req.url)
            let extension = path.extname(parsedUrl.pathname)
            let filePath = undefined

            const contentType = req.headers["content-type"] || ""
            if(contentType.includes("urlencoded")) {
                body = parse(body)
            } else if(contentType.includes("json")) {
                body = JSON.parse(body)
            }

            msg.payload = body
            msg.req = req
            msg.res = res
            switch(req.method) {
                case "GET":
                    if(extension) {
                        // Static Files
                        filePath = path.join(process.cwd(), self.static, parsedUrl.pathname)
                    } else {
                        // Endpoints
                        let name = parsedUrl.pathname.replaceAll("/", "_")
                        extension = ".js"
                        filePath = path.join(process.cwd(), "route/get", name, `${name}${extension}`)
                    }
                    msg.query = parse(parsedUrl.query)
                    if(!msg.payload) msg.payload = msg.query
                    responser({ msg, filePath, extension, staticPath: self.static })
                    break
                case "POST":
                    // Endpoints
                    let name = parsedUrl.pathname.replaceAll("/", "_")
                    extension = ".js"
                    filePath = path.join(process.cwd(), "route/post", name, `${name}${extension}`)
                    responser({ msg, filePath, extension, staticPath: self.static })
                    break
                case "PUT":
                    // Silent is gold
                    break
                case "PATCH":
                    // Silent is gold
                    break
                case "DELETE":
                    // Silent is gold
                    break
            }
        })

    }
}