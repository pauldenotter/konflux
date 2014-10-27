var el = document.getElementById('parsed'),
    url = el.dataset.url,
    parsed = kx.url.parse(url);

el.appendChild(document.createTextNode(JSON.stringify(parsed, null, '\t')));
