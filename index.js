const express = require('express')
const path = require('path')
const { PythonShell } = require('python-shell')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const listEndpoints = require('express-list-endpoints')
const fsPromises = require('fs').promises


const customMiddleware = async (req, res, next) => {
  console.log(':)')
  next()
}

const links = async () => {
  const files = await fsPromises.readdir(__dirname + '/views/pages')
  let hrefs = []
  for (const file of files) {
    const buffer = await fsPromises.readFile(__dirname + '/views/pages/' + file)
    const html = buffer.toString().match(/(?<=href=[\'\"])([^\'\"]+)/g)
    if (html) {
      for (const href of html) {
        hrefs.push(href.toLowerCase())
      }
    }
  }
  return Array.from(new Set(hrefs))
}

const generateRoutes = async (app) => {
  Array.from(await links()).map((route) => {
    app.get(route, (req, res) => {
      res.render(`pages/${route}`)
    })
  })
}

const app = express()

app
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, '/views'))
  .use('/favicon', express.static(__dirname + '/favicon'))
  .use('/css', express.static(__dirname + '/css'))
  .use('/js', express.static(__dirname + '/js'))
  .use('/py', express.static(__dirname + '/py'))
  .use('/img', express.static(__dirname + '/img'))
  .use('/markdown', express.static(__dirname + '/markdown'))
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
  .use(customMiddleware)
  .get('/avoir', async (req, res) => {
    res.render('pages/avoir')
  })
  .use(async (req, res, next) => {
    await generateRoutes(app)
    next()
  })
  .get('/', async (req, res) => {
    res.render('index', { links: await links() })
  })
  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
