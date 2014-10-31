var el = document.getElementById('result'),
    selectors = [
        'div#main.active',
        'div',
        '.active',
        '#main',
        'div#main',
        'div.active',
        '#active.main'
    ],
    specificity = kx.iterator(selectors).map(function(selector) {
        return selector + ' => ' + kx.style.specificity(selector);
    }).collection().join('\n');

el.appendChild(document.createTextNode(specificity));
