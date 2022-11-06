const express = require('express')
const path = require('path')
const { PythonShell } = require('python-shell')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const listEndpoints = require('express-list-endpoints')
const fsPromises = require('fs').promises
const fs = require('fs')
const Handlebars = require('handlebars')
const links = require('./utils/links')

// const links = async () => {
//   const files = await fsPromises.readdir(__dirname + '/views/pages')
//   let hrefs = []
//   for (const file of files) {
//     const buffer = await fsPromises.readFile(__dirname + '/views/pages/' + file)
//     const html = buffer.toString().match(/(?<=href=[\'\"])([^\'\"]+)/g)
//     if (html) {
//       for (const href of html) {
//         hrefs.push(href.toLowerCase())
//       }
//     }
//   }
//   return Array.from(new Set(hrefs))
// }

const boot = async () => {
  const app = express()

  app
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
      res.render('index', { links: await links() })
    })
    .get('/indien',async  (req, res) => {
      res.render('pages/indien', { links: await links() })
    })
    .get('/love',async  (req, res) => {
      res.render('pages/love', { links: await links() })
    })
    .get('/latin',async  (req, res) => {
      res.render('pages/latin', { links: await links() })
    })
    Array.from(await links()).map((route) => {
      route = encodeURI(route)
      app.get(route, async (req, res) => {
        if(route === '/index') {
          res.redirect('/')
        }
        else {
          res.render(`pages${route}`, {links: await links()}, async (err, html) => {
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
    app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
}

boot()
