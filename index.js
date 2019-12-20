const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
  //__dirname : It will resolve to your project folder.
})

//add the router
app.use('/favicon', express.static(__dirname + '/favicon'))
app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/img', express.static(__dirname + '/img'))
app.use('/', router)
app.listen(process.env.port || 8000)

console.log('Running at Port 8000')
