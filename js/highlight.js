$('document').ready(() => {
    const pathname = decodeURI(window.location.pathname.replace('/', ''))

    console.log(pathname)

    const pre = $('pre')
    const html = pre.text()

    let links = JSON.parse(document.querySelector('script[data-links]').getAttribute('data-links')).map(link => link.replace('/', ''))

    let words = html.match(/\w+/gi)
    const hrefs = pre.html().match(/(?<=href=[\'\"])([^\'\"]+)/g) || []
    links = words
                .filter(word => word.toLowerCase() !== pathname)
                // filtre not html tag
                // .filter(word => word.length > 3)
                .filter(word => links.includes(word))

    links= Array.from(new Set(links))

    for (const link of links) {
        if( links.filter(w => w.includes(link)).length === 1 ) {
            if( !hrefs.includes('/' + link)) {
                pre.html(pre.html().replaceAll(' ' +link, ` <a href="/${link}">${link}</a>`))

            }
        }
    }

    console.log(links, words)


    const tags = pre.html().match(new RegExp('(<\s*a[^>]*>(.*?)<\s*/\s*a>)+(?![a-z])',"gi")) || []





    // else {
        tags.map(tag=> {
            if(tag.match(/(?<=href=[\'\"])([^\'\"]+)/g).find(tag => tag.includes(pathname))) {

                let link =tag.match(/(?<=href=[\'\"])([^\'\"]+)/g).find(tag => tag.includes(pathname)).replace('/','')
                // console.log(link)
                pre.html(pre.html().replaceAll(`<a href="/${link}">${link}</a>`, `<a href="/${link}">${link.replace(pathname,`<i>${pathname}</i>`)}</a>`))
            }

            if(tag.match(/(?<=href=[\'\"])([^\'\"]+)/g).join('').replaceAll('/','') === pathname) {
                // console.log(pathname)
                pre.html(pre.html().replace(tag, `<i>${tag}</i>`))
            }
        })


    // }

    const pathnameInTags = tags.filter(tag=> tag.match(/(?<=href=[\'\"])([^\'\"]+)/g).find(tag => tag.includes(pathname)))
    // console.log( links, tags, pathnameInTags, '----------------')

    if(pathnameInTags.length === 0) {
        const pathnameInHtml = pre.html().match(new RegExp(pathname + '(?![^<]*>)',"gi")) || []
        pathnameInHtml.map(pathname=> pre.html(pre.html().replace(pathname, `<i>${pathname}</i>`)))
    }

    // " <a href='lorem'>lorem</a> ipsum dolores".replace(/<[^>]*>/g, '')
})
