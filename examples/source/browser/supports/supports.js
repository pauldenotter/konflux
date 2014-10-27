var el = document.getElementById('support'),
    feature = 'WeakMap',
    support = kx.browser.supports(feature);

 el.appendChild(document.createTextNode(
    'Your browser does' + (support ? '' : ' not') + ' support ' + feature
));
