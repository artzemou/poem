const express = require('express')
const path = require('path')
const {PythonShell} = require('python-shell')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const listEndpoints = require('express-list-endpoints')
// const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require ('node-html-markdown')
// const fs = require('fs');

var randomWords = require('random-words');

const app = express()


app.set('view engine', 'ejs')
  .use('/favicon', express.static(__dirname + '/favicon'))
  .use('/css', express.static(__dirname + '/css'))
  .use('/js', express.static(__dirname + '/js'))
  .use('/py', express.static(__dirname + '/py'))
  .use('/img', express.static(__dirname + '/img'))
  .use('/markdown', express.static(__dirname + '/markdown'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .get('/accueil', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/accueil.html'))
  })
  .get('/F', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/F.html'))
  })
  .get('/fLuXuS', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/fLuXuS.html'))
  })
  .get('/neige', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/neige.html'))
  })
  .get('/place', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/place.html'))
  })
  .get('/visage', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/visage.html'))
  })
  .get('/voyage', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/voyage.html'))
  })
  .get('/Waterloo', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/Waterloo.html'))
  })
  .get('/cymbale', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/cymbale.html'))
  })
  .get('/c', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/c.html'))
  })
  .get('/do', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/do.html'))
  })
  .get('/dodo', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/dodo.html'))
  })
  .get('/paradoxe', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/paradoxe.html'))
  })
  .get('/axe', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/axe.html'))
  })
  .get('/ici', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/ici.html'))
  })
  .get('/suite', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/suite.html'))
  })
  .get('/ui', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/ui.html'))
  })
  .get('/gospel', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/gospel.html'))
  })
  .get('/la', function(req, res) {find
    res.sendFile(path.join(__dirname + '/views/la.html'))
  })
  .get('/anagramme', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/anagramme.html'))
  })
  .get('/mezzanine', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/mezzanine.html'))
  })
  .get('/comprendre', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/comprendre.html'))
  })
  .get('/ordre', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/ordre.html'))
  })
  .get('/floeur', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/floeur.html'))
  })
  .get('/deux', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/deux.html'))
  })
  .get('/trois', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/trois.html'))
  })
  .get('/si', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/si.html'))
  })
  .get('/sic', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/sic.html'))
  })
  .get('/os', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/os.html'))
  })
  .get('/ivoire', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/ivoire.html'))
  })
  .get('/baleine', function(req, res) {
    res.render('baleine')
  })
  .get('/luciole', function(req, res) {
    res.render('luciole')
  })
  .get('/reste', function(req, res) {
    res.render( 'reste')
  })
  .get('/micro-onde', function(req, res) {
    res.render( 'micro-onde')
  })
  .get('/chou', function(req, res) {
    res.render('chou')
  })
  .get('/readaptee', function(req, res) {
    res.render('readaptee')
  })
  .get('/lexique', function(req, res) {
    res.render('lexique')
  })
  .post('/', function(req, res) {
    PythonShell.run('py/anagram.py', {args:[req.body.str]}, function (err, results) {
      if (err) throw err;
      if (results[0] === '[]') results[0] = '["oops"]'
      res.json(results[0]);
    });

  })
  .get('/anagram', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/anagram.html'))
  })
  .post('/api-endpoints', function (req, res) {
    res.json(listEndpoints(app))
   })
  // .post('/html-to-markdown', (req, res) => {
  //   req.body.forEach(el => {
  //     console.log(el.split(" ").filter((word)=> word.trim().match(/[A-Z]/g)))
  //     const words = el.split(" ").filter((word)=> word.trim().match(/[A-Z]/g))
  //     const title = words[Math.floor(Math.random() * words.length)]
  //     fs.writeFile(`./markdown/${title}.md`,  NodeHtmlMarkdown.translate(`<pre>${el}</pre>`), err => {
  //       if (err) {
  //         console.error(err);
  //       }
  //       // file written successfully  /[^a-z0-9]/gi,''
  //     })
  //   })

  //  })
  .get('/*', function(req, res) {
    res.render('index')
  })

  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
