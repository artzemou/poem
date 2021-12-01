
$('document').ready(() => {
    let pathname = window.location.pathname.replace('/', '')
    let regex = new RegExp(pathname + '(?![^<]*>)',"gi")
    $('pre').html($('pre').html().replace(regex, '<i>' + pathname + '</i>'))

})