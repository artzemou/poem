
$('document').ready(() => {
    let pathname = window.location.pathname.replace('/', '')
    let hrefs=   $('pre').html().match(new RegExp('<a href=\"([^\"]*)\">', "gi"))
    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
    $('pre').html($('pre').html().replace(new RegExp(pathname, "gi"), '<i>' + pathname + '</i>'))
//     hrefs.forEach( (href, index) => {
//         $('pre').html($('pre').html().replace('', href));
//     })
})