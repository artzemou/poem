import request from 'supertest'
import app from '../app.js'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pagesDir = path.join(__dirname, '../views/pages')
const generatedPage = path.join(pagesDir, 'hkljhk-test.ejs')
const generatedAccentPage = path.join(pagesDir, 'épreuve-test.ejs')

afterEach(async () => {
  delete process.env.POEM_AUTHOR_MODE
  await Promise.all([
    fs.rm(generatedPage, { force: true }),
    fs.rm(generatedAccentPage, { force: true })
  ])
})

describe('Test the root path', () => {
  it('It should response 200', async () => {
    await request(app)
      .get('/')
      .expect(200)
      .expect(({text}) => {
        expect(text).toContain("boa")
      })
  })
})

describe('Test 404 redirection', () => {
  it('It should response 404 without creating a page in test mode', async () => {
    await request(app).get('/hkljhk-test').expect(404)
    await expect(fs.access(generatedPage)).rejects.toThrow()
  })

  it('It should create a missing page in author mode', async () => {
    process.env.POEM_AUTHOR_MODE = 'true'

    await request(app)
      .get('/hkljhk-test')
      .expect(200)
      .expect(({ text }) => {
        expect(text).toContain('hkljhk-test')
      })

    await expect(fs.access(generatedPage)).resolves.toBeUndefined()
  })

  it('It should normalize new page names before creating them', async () => {
    process.env.POEM_AUTHOR_MODE = 'true'

    await request(app)
      .get('/e%CC%81preuve-test')
      .expect(200)
      .expect(({ text }) => {
        expect(text).toContain('épreuve-test')
      })

    await expect(fs.access(generatedAccentPage)).resolves.toBeUndefined()
  })

  it('It should refuse unsafe page names in author mode', async () => {
    process.env.POEM_AUTHOR_MODE = 'true'

    await request(app).get('/hkljhk%2Ftest').expect(404)
    await expect(fs.access(path.join(pagesDir, 'hkljhk/test.ejs'))).rejects.toThrow()
  })

  it('It should render legacy encoded page filenames', async () => {
    await request(app)
      .get('/cl%C3%A9')
      .expect(200)
      .expect(({ text }) => {
        expect(text).toContain('clé')
      })
  })
})
