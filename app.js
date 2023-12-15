const express = require('express')
const path = require('path')
const { PythonShell } = require('python-shell')
const bodyParser = require('body-parser')
const listEndpoints = require('express-list-endpoints')
const fs = require('fs')
const Handlebars = require('handlebars')
const links = require('./utils/links')

const app = express()
app.use(express.json())
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, '/views'))
  .use('/favicon', express.static(__dirname + '/favicon'))
  .use('/css', express.static(__dirname + '/css'))
  .use('/js', express.static(__dirname + '/js'))
  .use('/py', express.static(__dirname + '/py'))
  .use('/img', express.static(__dirname + '/img'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .post('/', (req, res) => {
    PythonShell.run(
      'py/anagram.py',
      { args: [req.body.str] },
      (err, results) => {
        if (err) throw err
        if (results[0] === '[]') results[0] = '["oops"]'
        res.json(results[0])
      }
    )
  })
  .get('/anagram', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/anagram.html'))
  })
  .post('/api-endpoints', (req, res) => {
    res.json(listEndpoints(app))
  })
  .get('/', async (req, res) => {
    res.status(200).render('index', { links: await links() })
  })
  .get('/indien', async (req, res) => {
    res.render('pages/indien', { links: await links() })
  })
  .get('/love', async (req, res) => {
    res.render('pages/love', { links: await links() })
  })
  .get('/latin', async (req, res) => {
    res.render('pages/latin', { links: await links() })
  })

const generateRoutes = async () => {

  const routes = await links()
  routes.map((route) => {
    route = encodeURI(route)
    app.get(route, async (req, res) => {
      if (route === '/index') {
        res.redirect('/')
      } else {
        res.render(`pages${route}`, { links: await links() }, (err, html) => {
          if (err) {
            if (!err.view.path) {
              const source = fs.readFileSync(
                __dirname + '/views/partials/template.ejs',
                'utf8'
              )
              const template = Handlebars.compile(source)
              const html = template({ word: decodeURI(route).replace('/', '') })
              fs.writeFile(
                path.join(__dirname + `/views/pages${route}.ejs`),
                html,
                (err) => {
                  if (err) throw err
                  console.log('New Page is created.')
                  res.redirect(route)
                }
              )
            }
          } else {
            res.send(html)
          }
        })
      }
    })
  })
  app.use((req, res) => {
    res.status(404).redirect('/')
  })


}

generateRoutes()


module.exports = app
