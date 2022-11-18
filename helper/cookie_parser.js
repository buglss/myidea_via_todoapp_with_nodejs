module.exports = function(cookies = "") {
    let parsedCookies = {}
    cookies.split(";").forEach(cook => {
        let [name, value] = cook.split("=")
        parsedCookies[name] = value
    })
    return parsedCookies
}