var timeToCheck = getRand(),
    elapsedEl = document.getElementById('elapsed'),
    button = document.getElementById('checkScore'),
    interval;

document.getElementById('timeToCheck').textContent = timeToCheck;

kx.event.add(button, 'click', function() {
    var time = kx.elapsed().slice(-3),
        won = time > timeToCheck-50 && time < timeToCheck+50;
    alert((won ?
        'WHOOOP! You did it!' :
        'So close, hit between ' + (timeToCheck - 50) + ' and ' + (timeToCheck + 50) + '!'
    ));
});

function run() {
    interval = setInterval(function() {
       elapsedEl.textContent = kx.elapsed().slice(-3);
    }, 100);
}

function getRand() {
    return +('000' + Math.floor(Math.random() * 999) + 1).slice(-3);
}

run();
