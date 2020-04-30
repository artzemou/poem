const router = require('express').Router()
const {PythonShell} = require('python-shell')
const path = require('path')

router
  .get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
  })
  .post('/', function(req, res) { 
    console.log(req.body)
    PythonShell.run('anagram.py', {args:[req.body.str]}, function (err, results) {
      if (err) throw err;
      console.log(results);
      res.send(results[0])
    });
    
  })
  


module.exports = router;