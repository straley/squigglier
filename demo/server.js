const express = require('express')
const path = require('path')
const app = express()
const port = 3000

console.log(path.join(__dirname, '../dist'))

app.use('/', express.static(path.join(__dirname, 'public'), {redirect: false, index: ['index.html']}))
app.use('/release', express.static(path.join(__dirname, '../release'), {redirect: false, index: ['index.html']}))

app.listen(port, () => console.log(`Demo listening on port ${port}!`))