const fsPromises = require('fs').promises

const links = async () => {
  const files = await fsPromises.readdir('views/pages')
  let hrefs = []
  for (const file of files) {
    const buffer = await fsPromises.readFile('views/pages/' + file)
    const html = buffer.toString().match(/(?<=href=[\'\"])([^\'\"]+)/g)
    if (html) {
      for (const href of html) {
        hrefs.push(href.toLowerCase())
      }
    }
  }
  return Array.from(new Set(hrefs))
}


module.exports = links
