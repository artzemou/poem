$(document).ready(() => {
    fetch('/backbone', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({str: $('[name=str]').val()})
      }).then(res => res.json())
        .then(res => {
            console.log(res)

        })

})