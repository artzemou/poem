$('document').ready(function () {
    var query = {};
    if (location.search) {
        location.search.substr(1).split`&`.forEach(item => {let [k,v] = item.split`=`; v = v && decodeURIComponent(v); (query[k] = query[k] || []).push(v)})
        search(query.search[0])
        setTimeout(function () {
            $('p, pre').removeClass('closed')            
        }, 400)
    }
    else {init()}    
})

function init(){
    $('p, pre').each(function () {
        //$(this).lettering('lines')
        var character = []
        var str = $(this).text().toLowerCase().replace(/\s+/g, '')
        // console.log(str.length)
        for (var i = 0; i < str.length; i++) {
            character.push(str.substr(i, 1))
        }
        // console.log(character)
        console.log($(this).text())
        console.log(countOccurences(character))
    })

    setTimeout(function () {
        $('p, pre').addClass('lisible float')
        setTimeout(function () {
            $('p, pre').addClass('closed')
            $('p, pre').on('click', function () {
                // $('.opened').removeClass('opened').addClass('closed')
                $(this).toggleClass('closed') 
                console.log($(this).width())
                console.log($(this).height())
                // $(this).width($(this).height())
            })
            // $('.lisible').on('click', function(){
            //     console.log($(this).text().split(''))
            //     console.log(aleatoire($(this).text().split('')), typeof aleatoire($(this).text().split('')))
            //     $(this).html(aleatoire($(this).text().split('')))
            // })
            $("p, pre").click(function(e) {
                s = window.getSelection();
                var range = s.getRangeAt(0);
                var node = s.anchorNode;
                while (range.toString().indexOf(' ') != 0) {
                    range.setStart(node, (range.startOffset - 1));
                }
                range.setStart(node, range.startOffset + 1);
                do {
                    range.setEnd(node, range.endOffset + 1);
            
                } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < node.length);
                var str = range.toString().trim();
                // alert(str);
                location.search = "search=" + str
            });
            
        }, 300)
       
    }, 0)
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
            letter: key,
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

let  all = []
function search(str) {
    
    if(all.length > 0) {
        all.forEach(pre => {
            $( ".container" ).append( pre )
        })
    }
    let preList = []
    $('pre').each(function() {
        var $this = jQuery(this);
        $this.removeClass('closed')
        str = str.toLowerCase()
        all =[ ...all, $this]
        if ($this.text().includes(str)){
            $this.html($this.text()
                .replace(str, str.bold())
                .replace(reverseString(str), reverseString(str).bold()))
            preList = [ ...preList, $this]
        }

        if ($this.text().includes(capitalize(str))) {
            console.log(capitalize(str), capitalize(str).bold())
            $this.html($this.text()
                .replace(capitalize(str), capitalize(str).bold())
                .replace(capitalize(reverseString(str)), reverseString(capitalize(str)).bold()))
            preList = [ ...preList, $this]
        }
    })
    $( ".container" ).html( "" )
    preList.forEach(pre => {
        
        $( ".container" ).append( pre )
    })
    init()
    
    	
}

const capitalize = (s) => {
    if ( !/^[A-Z]/.test(s) ) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    else {
        return s
    }   
}

function reverseString(str) {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}


