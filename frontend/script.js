window.onload = async function () {
    const url = 'http://localhost:3000'
    const res = await fetch(url + '/coffee')
    const varieties = await res.json()
    console.log(varieties)
}
