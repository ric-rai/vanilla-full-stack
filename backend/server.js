const http = require('http')
let l

const server = (list) => http.createServer((req, res) => {
    l = list
    switch (req.method) {
        case 'POST': handlePost(req, res); break
        case 'GET': handleGet(req, res); break
        default: res.writeHead(404).end()
    }
})

function handleGet(req, res) {

}

function handlePost(req, res) {
    switch (req.url) {
        case '/coffee': saveCoffeeVariety(req, res); break
        default: res.writeHead(404).end()
    }
}

function saveCoffeeVariety(req, res) {
    let data = ''
    req.on('data', chunk => data += chunk)
    req.on('end', () => {
        const obj = parseJSON(data)
        const list = JSON.parse(l.read())
        const i = list.findIndex(e => e.name === obj.name)
        i < 0 ? list.push(obj) : list[i] = obj
        l.write(JSON.stringify(list))
        res.writeHead(201, {'Content-Type': 'application/json'}).end(data)
    })
}

function parseJSON(string) {
    try { return JSON.parse(string) }
    catch (e) {}
}

module.exports = server
