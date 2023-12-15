$('document').ready(function () {
//   $('p, pre').addClass('closed')
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
    let extraSymbols = countOccurences(symbols).map((symbol) => symbol.sign)
    console.log(extraSymbols.join(''))
  })
})

function countOccurences(tab) {
  var result = {}
  var sortedResult = []

  tab.forEach(function (elem) {
    if (elem in result) {
      result[elem] = ++result[elem]
    } else {
      result[elem] = 1
    }
  })

  for (let [key, value] of Object.entries(result)) {
    if (!(value % 2 === 0))
      sortedResult.push({
        sign: key,
        count: value,
      })
  }
  return sortedResult
}

function aleatoire(str) {
  let result = ''
  for (i = 0; i < str.length; i++) {
    result += str[Math.floor(Math.random() * str.length)]
  }
  console.log(result)
  return result
}

const capitalize = (s) => {
  if (!/^[A-Z]/.test(s)) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  } else {
    return s
  }
}

const reverseString = (str) => {
  return str === '' ? '' : reverseString(str.substr(1)) + str.charAt(0)
}

const shuffleArray = (arr) =>
  arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1])
