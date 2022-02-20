const puppeteer = require('puppeteer')
let mockList, list = {read: () => mockList, write: (c) => mockList = c}
const server = require('./server.js')(list)
const host = '127.0.0.1', port = 3001
const url = `http://${host}:${port}`

const equal = (desc, ac, ex) => () => ac === ex ? true :
    console.log(`${desc}:\nExpected: ${ex}\nActual: ${ac}`)
const assert = (sMsg, ...assertions) => assertions.map(f => f()).every(v => v) ?
    console.log(sMsg) : console.log()

async function postTest(page) {
    console.log('Testing POST: /coffee')
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
    console.log('\nStarting server')
    server.listen(port, host)
    console.log(`Listening at http://${host}:${port}`)
    console.log('Server started')
    const browser = await puppeteer.launch()
    const postPage = await browser.newPage()
    await postTest(postPage)
    await browser.close()
    server.close()
    process.exit(0)
})()
