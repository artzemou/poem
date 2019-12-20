$('document').ready(function () {

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
            $('p, pre').addClass('clicked')
            setTimeout(function () {
              // $('.open').removeClass('clicked')
              // $('span').lettering()
            }, 300)
          }, 300)
        }, 0)

        $('p, pre').on('click', function () {
          $(this).toggleClass('clicked')
        })
      })

      function countOccurences(tab) {
        var result = {};
        var sortedResult = []
        tab.forEach(function (elem) {
          if (elem in result) {
            result[elem] = ++result[elem];
          } else {
            result[elem] = 1;
          }
        });
        
        for (let [key, value] of Object.entries(result)) {
          if (!(value % 2  === 0)) sortedResult.push({letter: key, count: value})
        }
        return sortedResult;
      }