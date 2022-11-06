
$('document').ready(() => {
    let pathname = window.location.pathname.replace('/', '')
    let regex = new RegExp(pathname + '(?![^<]*>)',"gi")

    $('pre').html($('pre').html().replace(regex, '<i>' + pathname + '</i>'))

})



// $('document').ready(() => {
//     const links = JSON.parse(document.querySelector('script[data-links]').getAttribute('data-links')).map(link => link.replace('/', ''))
//     const pathname = decodeURI(window.location.pathname.replace('/', ''))
//     const pre = $('pre')
//     // const words = pre.html().match(new RegExp( `(?![^<]*>)`,'gi' ))


//     // console.log(pre.html().match(/<[^>](.*?)*>/g))
//     let words = pre.text().match(/\w+/g)
//     // const tags = pre.html().match(/(?<=>)[\w+]+(?=<)/g)
//     // console.log(words)
//     // console.log(tags)

//     words = words
//                 .filter(word => word.toLowerCase() !== pathname)
//                 .filter(word => word.toLowerCase() !== 'ou')
//                 .filter(word => word.toLowerCase() !== 'o')
//                 .filter(word => word.toLowerCase() !== 'in')
//                 .filter(word => links.includes(word))
//                 // .filter(word => !tags.includes(word))
//                 // .concat(tags.filter(tag => !words.includes(tag)));

//     // words = Array.from(new Set(words))

//     console.log(words)

//     const html = pre.text()

//     // for(const link of links) {
//     //     if(words.includes(link)) {
//     //         console.log(link)
//     //         pre.html(html.replaceAll(link, `<a href ="/${link}">${link}</a>`))
//     //     }

//     // }

//     for (const word of words) {
//         pre.html(html.replaceAll(word, `<a href ="/${word}">${word}</a>`))
//     }
//     pre.html(pre.html().replace(new RegExp(pathname + '(?![^<]*>)',"gi"), `<i>${pathname}</i>`))

//     // for (const word of words) {
//     //     pre.html(pre.html().replaceAll(word, `<i>${word}</i>`))
//     // }
// })
