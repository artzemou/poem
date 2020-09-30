function getUrlParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&')
    const params = {}
    hashes.map(hash => {
        const [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })
    return params
}

function  getAllWord (words) {
    words= Array.from(new Set(words.filter(el=>el.trim().length>1)))
    console.log(words.length)
    shuffleArray(words).map(word=>{
       console.log(word)
       setTimeout(()=>{
           addElement(word)
       }, 10)
    })
}
var dico = false
$('document').ready(function () {
    let words = $(".container").text().split(' ')
    var query = {}
    let params = getUrlParams(window.location.search)
    // console.log(params)
    // let words = $('.container').text().replace(/[.,\/#!?$%\^&\*;:◯{}=\_“'"`~()]/g,"").trim().split(' ').filter(word => word!=="")
    // words = Array.from(new Set(words))
    // words.map(word => {
    //     $('nav ul').append('<li>'+word+'</li>')
    // })

    if(!dico) {
        $('p, pre').addClass('lisible float')

        $('p, pre').addClass('closed')
        $('p, pre').on('click', function () {
            $(this).toggleClass('closed')
    
        })
        $('p, pre').each(function () {
            var symbols = []
            var str = $(this).text().toLowerCase().replace(/\s+/g, '')
            // console.log(str.length)
            for (var i = 0; i < str.length; i++) {
                symbols.push(str.substr(i, 1))
            }
            // console.log(character)
            console.log($(this).text())
            console.log(countOccurences(symbols))
            let extraSymbols = countOccurences(symbols).map((symbol) => (symbol.sign))
            console.log(extraSymbols)
            console.log($(this)[0].classList[0])
            console.log($(this).width())
            console.log($(this).height())

            // $('.flux').append( $(this).html())  
        })
        getAllWord(words)
        return
    }


    if (params.search) {
        search(params.search, params.shadow)
        setTimeout(function () {
            $('p, pre').removeClass('closed')
        }, 400)
    }
    else {
        // search('moteur')
        search('Pense-bête')
        setTimeout(function () {
            $('p, pre').removeClass('closed')
        }, 400)
    }

    
   


    // just grab a DOM element
    // var element = document.querySelector('#scene')

    // And pass it to panzoom
    // panzoom(element, {
    //     maxZoom: 2,
    //     minZoom: 0.3,
    //     beforeMouseDown: function(e) {
    //         // allow mouse-down panning only if altKey is down. Otherwise - ignore
    //         var shouldIgnore = !e.altKey;
    //         e.stopPropagation()
    //         return shouldIgnore;
    //     }
    // }) 


})

function init() {

    $('p, pre').each(function () {
        var symbols = []
        var str = $(this).text().toLowerCase().replace(/\s+/g, '')
        // console.log(str.length)
        for (var i = 0; i < str.length; i++) {
            symbols.push(str.substr(i, 1))
        }
        // console.log(character)
        console.log($(this).text())
        console.log(countOccurences(symbols))
        let extraSymbols = countOccurences(symbols).map((symbol) => (symbol.sign))
        console.log(extraSymbols)
        console.log($(this)[0].classList[0])
        console.log($(this).width())
        console.log($(this).height())
        // setTimeout(()=> {
        //     let dim = ($(this).width() + $(this).height()) / 2
        //     $(this).width(dim)
        //     $(this).height(dim)

        // }, 300)
        // console.log($(this).width())
        // console.log($(this).height())


    })

    setTimeout(function () {
        $('p, pre').addClass('lisible float')
        setTimeout(function () {
            $('p, pre').addClass('closed')
            $('p, pre').on('click', function () {
                $(this).toggleClass('closed')

            })

            $('pre, b').click(function (e) {
                s = window.getSelection();
                console.log(s, s.anchorNode.nodeValue)
                var range = s.getRangeAt(0);
                var node = s.anchorNode;
                try {
                    while (range.toString().indexOf(' ') != 0) {
                        range.setStart(node, (range.startOffset - 1));
                    }
                    range.setStart(node, range.startOffset + 1);
                    do {
                        console.log(range.endOffset)
                        range.setEnd(node, range.endOffset + 1);

                    } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < node.length);
                    var str = range.toString().trim();
                    console.log(str)
                }
                catch {
                    // console.debug('Bold element clicked')
                    var str = s.anchorNode.nodeValue.trim()
                }


                str = str.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\_“'"`~()]/g, "").trim()
                // str = str.toLowerCase().replace(/[.,\/#!?$%\^&\*;:{}=\-_“'"`~()]/g,"").trim()
                if (str.split(' ').length > 1) str = str.split(' ')[Math.floor(Math.random() * str.split(' ').length)]
                console.log(str)
                fetch("/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ str: str })
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        if (!data.length) data.push(str)
                        data.map((w) => {
                            console.debug(w)
                            location.search = 'search=' + data[Math.floor(Math.random() * data.length)]
                        })

                    })

            })
        }, 300)

    }, 0)

    // $('h1').click(function(){
    //     // search('fonctionnalité')
    //     location.search = 'search=' +'fonctionnalité'
    // })
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    }
    else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}



function countOccurences(tab) {
    var result = {};
    var sortedResult = []

    tab.forEach(function (elem) {
        if (elem in result) {
            result[elem] = ++result[elem];
        } else {
            result[elem] = 1
        }
    });

    for (let [key, value] of Object.entries(result)) {
        if (!(value % 2 === 0)) sortedResult.push({
            sign: key,
            count: value
        })
    }
    return sortedResult;
}


function aleatoire(str) {
    let result = ''
    for (i = 0; i < str.length; i++) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    console.log(result);
    return result
}

function addElement (word) {
    console.log(word)
    // crée un nouvel élément span
    let span = document.createElement("span");
    // et lui donne un peu de contenu
    word = document.createTextNode(word);
    // ajoute le nœud texte au nouveau span créé
    span.appendChild(word);
    
    // ajoute le nouvel élément créé et son contenu dans le DOM
    $('#words-list').append(span);
  }

let all = [], SHadō = []
function search(str, shadow) {
    
   
    // if(all.length > 0) {
    //     all.forEach( pre => {
    //         $( ".container" ).append( pre )
    //     })

    // }
    let preList = []
    $('p, pre').each(function () {
        var $this = jQuery(this);
        $this.removeClass('closed')
        str = str.toLowerCase()
        all = [...all, $this]

        if ($this.text().length > 1) {
            let ponct = $this.text()
            ponct = ponct.replace(/([0-9-A-Za-zÀ-ÖØ-öø-ÿ/]+[^↵])/g, '')
            SHadō = [...SHadō, `<pre style="width: 2<5%;line-height: 1.1;font-size: 20px;letter-spacing: -13px;font-size: 13px;line-height: 2px">${ponct}</pre>`]
        }
        if ($this.text().toLowerCase().includes(str) || $this.text().includes(str) || $this.text().includes(capitalize(str))) {
            $this.html($this.html()
                .replace(new RegExp(str, "g"), str.bold())
                .replace(new RegExp(capitalize(str), "g"), capitalize(str).bold())
                .replace(new RegExp(reverseString(str), "g"), reverseString(str).bold())
                .replace(new RegExp(reverseString(capitalize(str)), "g"), reverseString(capitalize(str)).bold()))

            preList = [...preList, $this]
        }

    })
    $(".container").html("")
    // if(preList.length === 0) {
    //     console.log('Oops')
    //     search('Oops')
    // }
    // $( ".container" ).append( all)


    let index = Math.floor(Math.random() * preList.length)
    let pre = preList[index]
    console.log(preList.length)
    console.log(SHadō.length)
    $(".container").append(pre)
    // $(".container").append(SHadō[index])
    // shadow=true
    // $('pre').append('<div class="gost"></div>')
    // $('.gost').html(shuffleArray($('pre').text().split('')).join(''))
    // preList.forEach((pre, i) => {
        
    //     // let max = preList.length , min = 0
    //     // if(preList.length > 9){
            
    //     //     if(shadow) $( ".container" ).append( SHadō[Math.floor(Math.random()*preList.length)])
    //     //     else $( ".container" ).append( preList[Math.floor(Math.random() * 9)] )
    //     // } 
    //     // else {
    //     //     if(shadow) $( ".container" ).append( SHadō[Math.floor(Math.random()*preList.length)])
    //     //     else $( ".container" ).append( preList[Math.floor(Math.random()*preList.length)])
    //     // }
    //     // $( ".container" ).append(pre)
    // })
    init()
}

const capitalize = (s) => {
    if (!/^[A-Z]/.test(s)) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    else {
        return s
    }
}

const reverseString = (str) => {
    return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}

const shuffleArray = arr => arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);


