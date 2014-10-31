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
    filterLang = 'javascript',
    el = document.getElementById('filtered'),
    result;

result = kx.iterator(items).filter(function(object) {
    return object.language === filterLang;
}).collection();

el.appendChild(document.createTextNode(JSON.stringify(result, null, '\t')));
