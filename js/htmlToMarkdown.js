
document.addEventListener("DOMContentLoaded", () => {  
    const logbook = Array.from(document.querySelectorAll('pre')).map(el => el.innerHTML)

    fetch('/html-to-markdown', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logbook)
      }).then(res => res.json())
        .then(res => {
          console.log(res)

        })
});
