var a = kx.point(2.1415, 15.142),
    b = kx.point(425, 2),
    mid = a.mid(b),
    min = a.min(b),
    max = a.max(b),
    el = document.getElementById('result');

el.appendChild(document.createTextNode(
    'Angle: ' + a.angle(b) + '\n' +
    'Distance: ' + a.distance(b) + '\n' +
    'Middle: ' + mid.x + ', ' + mid.y + '\n' +
    'Min: ' + min.x + ', ' + min.y + '\n' +
    'Max: ' + max.x + ', ' + max.y
));
