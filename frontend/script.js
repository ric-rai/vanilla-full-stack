(function(){
    const url = 'http://localhost:3000/coffee'
    window.onload = async function () {
        const res = await fetch(url)
        const varieties = await res.json()
        const table = document.getElementById('coffee-table')
        table.append(createTableBody(getHeaders(table), varieties))
        document.getElementById('coffee-save').addEventListener('click', saveHandler(table))
    }

    function getHeaders(table) {
        const thead = table.getElementsByTagName('thead')[0]
        const headerCells = thead.getElementsByTagName('td')
        return Array.from(headerCells).map(c => c.getAttribute('data-col-name'))
    }

    function createTableBody(headers, data) {
        const ce = document.createElement.bind(document)
        const objToValueArrayByKeyList = keyList => obj => keyList.map(key => obj[key])
        const strToCell = t => ((c = ce('td')) => (c.textContent = t, c))()
        const strArrayToCellArray = strArray => strArray.map(str => strToCell(str))
        const cellArrayToRow = cells => ((r = ce('tr')) => (r.append(...cells), r))()
        const rows = data.map(objToValueArrayByKeyList(headers)).map(strArrayToCellArray).map(cellArrayToRow)
        const inputRow = headers.map(() => ce('input')).map(i => ((td = ce('td')) => (td.append(i), td))())
        const tbody = document.createElement('tbody')
        return (tbody.append(...rows, cellArrayToRow(inputRow)), tbody)
    }

    function saveHandler(table) {
        const inputs = Array.from(table.getElementsByTagName('input'))
        return async () => {
            const newObj = getHeaders(table)
                .reduce((o, h, i) => (o[h] = inputs[i].value, o), {})
            const body = JSON.stringify(newObj)
            const headers = {'Content-Type': 'application/json'}
            const res = await fetch(url, {method: 'POST', headers: headers, body: body})
            if (res.status === 201) (inputs.forEach(i => i.value = ''), location.reload())
        }
    }
})()
