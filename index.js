const express = require('express')
const app = express()
const router = require('./router.js')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/favicon', express.static(__dirname + '/favicon'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))
// app.use('/', router)
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  })
app.listen(process.env.port || 8000)
console.log('Running at http://localhost:8000')
