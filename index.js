const express = require('express')
const path = require('path')
const {PythonShell} = require('python-shell')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')



express()
  .use('/favicon', express.static(__dirname + '/favicon'))
  .use('/css', express.static(__dirname + '/css'))
  .use('/js', express.static(__dirname + '/js'))
  .use('/img', express.static(__dirname + '/img'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  })
  .post('/', function(req, res) { 
    console.log(req.body)
    PythonShell.run('anagram.py', {args:[req.body.str]}, function (err, results) {
      if (err) throw err;
      if (results[0] === '[]') results[0] = '["oops"]'
      console.log(results);
      res.send(results[0])
    });
    
  })
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
