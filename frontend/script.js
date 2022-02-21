(function(){
    const url = 'http://localhost:3000/coffee'
    window.onload = async function () {
        const res = await fetch(url)
        const varieties = await res.json()
        const table = document.getElementById('coffee-table')
        const templateRow = table.querySelector('[data-template-row]')
        table.prepend(...dataToRows(templateRow, varieties))
        document.getElementById('coffee-save').addEventListener('click', saveHandler)
    }

    function dataToRows(templateRow, data) {
        const modelRow = templateRow.content
        return data.map(o => Object.entries(o).reduce((row, entry) => {
            const cell = row.querySelector(`[data-cell='${entry[0]}']`)
            cell.textContent = entry[1]
            return row
        }, modelRow.cloneNode(true)))
    }

    async function saveHandler() {
        const inputs = Array.from(document.querySelectorAll('[data-input]'))
        const newObj = inputs.reduce((o, i) => (o[i.getAttribute('data-input')] = i.value, o), {})
        const body = JSON.stringify(newObj)
        const headers = {'Content-Type': 'application/json'}
        const res = await fetch(url, {method: 'POST', headers: headers, body: body})
        if (res.status === 201) (inputs.forEach(i => i.value = ''), location.reload())
    }

})()
