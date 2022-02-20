window.onload = async function () {
    const url = 'http://localhost:3000'
    const res = await fetch(url + '/coffee')
    const varieties = await res.json()
    const table = document.getElementById('coffee-table')
    table.append(createTableBody(getHeaders(table), varieties))
    document.getElementById('coffee-save').addEventListener('click',saveHandler(table))
}

function getHeaders(table) {
    const thead = table.getElementsByTagName('thead')[0]
    const headerCells = thead.getElementsByTagName('td')
    return Array.from(headerCells).map(c => c.getAttribute('data-col-name'))
}

function createTableBody(headers, data) {
    const dc = document.createElement.bind(document)
    const objToValueArrayByKeyList = keyList => obj => keyList.map(key => obj[key])
    const strToCell = t => ((c = dc('td')) => (c.textContent = t) && c)()
    const strArrayToCellArray = strArray => strArray.map(str => strToCell(str))
    const cellArrayToRow = cells => ((r = dc('tr')) => (r.append(...cells)) || r)()
    const rows = data.map(objToValueArrayByKeyList(headers)).map(strArrayToCellArray).map(cellArrayToRow)
    const inputRow = headers.map(() => dc('input')).map(i => ((td = dc('td')) => td.append(i) || td)())
    const tbody = document.createElement('tbody')
    tbody.append(...rows, cellArrayToRow(inputRow))
    return tbody
}

function saveHandler(table) {
    const inputs = Array.from(table.getElementsByTagName('input'))
    return () => {

    }
}
