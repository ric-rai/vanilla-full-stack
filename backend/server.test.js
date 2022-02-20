const puppeteer = require('puppeteer')
let mockList, list = {read: () => mockList, write: (c) => mockList = c}
const server = require('./server.js')(list)
const host = '127.0.0.1', port = 3001
const url = `http://${host}:${port}`
const grn = "\x1b[1;32m", cyan = "\x1b[1;36m", red = "\x1b[1;31m", reset = "\x1b[0m"
const startMsg = msg => console.log(cyan + msg + reset)
const successMsg = msg => console.log('✅ ', grn + msg + reset, '\n')

const equal = (desc, ac, ex) => () => ac === ex ? true :
    console.log(`${desc}:${grn}\nExpected: ${reset}${ex}\n${red}Actual: ${reset}${ac}`)
const assert = (sMsg, ...assertions) => assertions.map(f => f()).every(v => v) ?
    successMsg(sMsg) : console.log()

async function postTest(page) {
    startMsg('Testing POST: /coffee')
    mockList = '[]'
    await page.setRequestInterception(true)
    const body = JSON.stringify({name: "Juhla Mokka", weight: 500, price: 5.79, roast: 1})
    const headers = {'Content-Type': 'application/json'}
    page.once('request', req =>
        req.continue({method: 'POST', postData: body, headers: headers}) &&
        page.setRequestInterception(false) )
    const [res] = await Promise.all([page.waitForResponse(r => r), page.goto(url + '/coffee')])
    const resObj = JSON.parse(await res.text())
    page.close()
    assert('POST succeeded',
        equal('POST status text', res.statusText(), 'Created'),
        equal('POST text', JSON.stringify(resObj), body),
        equal('Coffee list', mockList, '[' + body + ']')
    )
}

(async () => {
    startMsg('\nStarting server')
    server.listen(port, host)
    console.log(`Listening at http://${host}:${port}`)
    successMsg('Server started')
    const browser = await puppeteer.launch()
    const postPage = await browser.newPage()
    await postTest(postPage)
    await browser.close()
    server.close()
    process.exit(0)
})()
