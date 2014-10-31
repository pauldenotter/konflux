var arr = kx.array.shuffle(kx.array.range(1000, 9999)),
    el = document.getElementById('result');

el.appendChild(document.createTextNode(arr.join('\n')));
