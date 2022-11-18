module.exports = function(msg) {
    msg.res.setHeader("Set-Cookie", ["token="])
    msg.res.writeHead(302, { "Location": "/" })
    msg.res.end()
}