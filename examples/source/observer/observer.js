// this is a simple implementation of the observer pattern
// one can observe and notify kx.observer to loosly couple multiple modules
(function() {
    // module 1
    document.querySelector('input[name="observeme"]').onchange = function(event) {
        kx.observer.notify('myapp.change.observeme', event.target.value);
    };
})();

(function() {
    // module 2
    // call me on ALL myapp.* notifications
    kx.observer.subscribe('myapp.*', function(subscription, value) {
        console.log(value);
    });
})();
