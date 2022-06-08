$(document).ready(() => {
    fetch('/api-endpoints', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: ''
      }).then(res => res.json())
        .then(res => {
          let routes = res.map(route => route.path)
          console.log(routes)

        })

})