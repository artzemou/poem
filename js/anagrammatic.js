function getUrlParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&')
    const params = {}
    hashes.map(hash => {
        const [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })
    return params
}


var dico = false
$('document').ready(function () {
    let words = $(".container").text().split(' ')
    var query = {}
    let params = getUrlParams(window.location.search)

    if(!dico) {
        $('p, pre').addClass('lisible float')

        $('p, pre').addClass('closed')
        $('p, pre').on('click', function () {
            $(this).toggleClass('closed')

        })
        $('p, pre').each(function () {
            var symbols = []
            var str = $(this).text().toLowerCase().replace(/\s+/g, '')
            for (var i = 0; i < str.length; i++) {
                symbols.push(str.substr(i, 1))
            }
            console.log($(this).text())
            console.log(countOccurences(symbols))
            let extraSymbols = countOccurences(symbols).map((symbol) => (symbol.sign))
            console.log(extraSymbols.join(''))
        })
        return
    }


    if (params.search) {
        search(params.search, params.shadow)
        setTimeout(function () {
            $('p, pre').removeClass('closed')
        }, 400)
    }
    else {
        search('Pense-bête')
        setTimeout(function () {
            $('p, pre').removeClass('closed')
        }, 400)
    }
})

function init() {
    $('p, pre').each(function () {
        var symbols = []
        var str = $(this).text().toLowerCase().replace(/\s+/g, '')
        for (var i = 0; i < str.length; i++) {
            symbols.push(str.substr(i, 1))
        }
        console.log($(this).text())
        console.log(countOccurences(symbols))
        let extraSymbols = countOccurences(symbols).map((symbol) => (symbol.sign))
        console.log(extraSymbols)
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

let all = [], SHadō = []
function search(str, shadow) {

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



    let index = Math.floor(Math.random() * preList.length)
    let pre = preList[index]
    console.log(preList.length)
    console.log(SHadō.length)
    $(".container").append(pre)
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


