const http = require('http')
const fs = require("fs");
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
    switch (req.url) {
        case '/':
            req.url = '/index.html'
            sendStatic(req, res); break
        case '/coffee':
            sendCoffeeList(req, res); break
        case req.url.match(/^\/[\w.]+$/)?.input:
            sendStatic(req, res); break
        default: res.writeHead(404).end()
    }
}

// TODO: client side caching and subfolders
function sendStatic(req, res) {
    const fileName = /^\/[\w.]+$/.exec(req.url)[0]
    const file = readFile('frontend/' + fileName)
    if (file) {
        const extension = /\.(\w+)$/.exec(req.url)[1]
        const type = extension === 'js' ? 'javascript' : extension
        if (file) res.setHeader('Content-Type', 'text/' + type).end(file)
    } else res.writeHead(404).end()
}

function readFile(path) {
    try { return fs.readFileSync(path, 'utf8') }
    catch (e) {}
}

function sendCoffeeList(req, res) {
    const list = l.read()
    res.setHeader('Content-Type', 'application/json').end(list)
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
