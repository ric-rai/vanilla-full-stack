const fs = require('fs')
const path = './db.json'
const list = {}
list.read = () => fs.readFileSync(path, 'utf8')
list.write = (content) => fs.writeFileSync(path, content)
const server = require('./backend/server.js')(list)

try { fs.readFileSync(path, 'utf8') }
catch (e) { fs.writeFileSync(path, '[]') }

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
