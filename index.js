const http = require("node:http")
const router = require("./helper/router")
const _db = require("./storage/db")

DB = _db
router.static = process.env.HTTP_STATIC || "www"

const server = http.createServer(router.serve)

server.on("error", console.log)

const PORT = process.env.PORT || "8000"
const HOST = process.env.HOST || "127.0.0.1"

server.listen(PORT, HOST, () => {
    console.log(`Server now running at http://${HOST}:${PORT}`)
})