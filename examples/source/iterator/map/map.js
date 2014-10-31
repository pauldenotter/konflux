var items = [{
        name: 'konflux',
        language: 'javascript',
        url: 'https://github.com/konfirm/konflux'
    }, {
        name: 'konsolidate',
        language: 'hacklang',
        url: 'https://github.com/konfirm/konsolidate_hacklang'
    }, {
        name: 'konsolidate',
        language: 'php',
        url: 'https://github.com/konfirm/konsolidate'
    }, {
        name: 'konsent',
        language: 'javascript',
        url: 'https://github.com/konfirm/konsent'
    }],
    el = document.getElementById('mapped');

kx.iterator(items).map(function(object) {
    return '<a href="' + object.url + '">' + object.name + '</a> (' + object.language + ')';
}).each(function(value) {
    var li = document.createElement('li');
    li.innerHTML = value;
    el.appendChild(li);
});
