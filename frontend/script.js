(function(){
    const url = 'http://localhost:3000/coffee'
    window.onload = async function () {
        const res = await fetch(url)
        const varieties = await res.json()
        const table = document.getElementById('coffee-table')
        const tbody = table.querySelector('tbody')
        const templateRow = table.querySelector('[data-template-row]')
        tbody.prepend(...dataToRows(templateRow, varieties))
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
        const inputArray = Array.from(document.querySelectorAll('[data-input]'))
        const newObj = inputArray.reduce((o, i) => (o[i.getAttribute('data-input')] = i.value, o), {})
        const body = JSON.stringify(newObj)
        const headers = {'Content-Type': 'application/json'}
        const isValid = validateInputs(inputArray)
        if (isValid) {
            const res = await fetch(url, {method: 'POST', headers: headers, body: body})
            if (res.status === 201) {
                inputArray.forEach(i => i.value = '')
                location.reload()
            }
        }
    }

    function validateInputs(inputArray) {
        let isValid = true
        const patterns = {
            name: /^(?!\s*$).+/ ,
            weight: /^(0|([1-9]\d*))$/,
            price: /^[0-9]+(,\d{1,2})?$/,
            roast: /([12345])/
        }
        inputArray.forEach(i => {
            const ok = patterns[i.getAttribute('data-input')].test(i.value.trim())
            if (ok) i.classList.remove('invalid')
            else (isValid = false, i.classList.add('invalid'))
        })
        return isValid
    }

})()
