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
        const tbody = ce('tbody')
        return (tbody.prepend(...rows), tbody)
    }

    function saveHandler(table) {
        const inputCells = table.getElementsByClassName('input-row')[0].children
        const inputs = Array.from(inputCells).map(td => td.children[0])
        return async () => {
            const newObj = getHeaders(table)
                .reduce((o, h, i) => (o[h] = inputs[i].value, o), {})
            if (validateCoffeeVariety(newObj) || true) {
                const body = JSON.stringify(newObj)
                const headers = {'Content-Type': 'application/json'}
                const res = await fetch(url, {method: 'POST', headers: headers, body: body})
                if (res.status === 201) (inputs.forEach(i => i.value = ''), location.reload())
            } else Array.from(inputCells).forEach(c => c.style.backgroundColor = 'red')
        }
    }

    function validateCoffeeVariety(o) {
        return (Number.isInteger(o.weight) || console.log("invalid weight"))
            && (!isNaN(o.price) || console.log("invalid price"))
            && ([1, 2, 3, 4, 5].some(i => i === parseInt(o.roast)) || console.log("invalid roast"))
    }

})()
