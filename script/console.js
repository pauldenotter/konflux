;(function(window, kx) {
	'use strict';

	function Console(browserConsole, fiddleConsole)
	{
		var _console = this,
			config = {},
			doc = fiddleConsole.ownerDocument;

		function getReplacement(method)
		{
			return function() {
				var msg = doc.createElement('li'),
					msgString = Array.prototype.slice.call(arguments).map(function(arg) {
						switch (typeof arg)
						{
							case 'object':
								return JSON.stringify(arg);

							case 'undefined':
								return 'undefined';

							default:
								return arg;
						}
					}).join(' ');

				if ('function' === typeof config[method])
					config[method].apply(this, arguments);

				msg.appendChild(doc.createTextNode(msgString));
				msg.setAttribute('class', method);
				fiddleConsole.appendChild(msg);
			};
		}

		(function init() {
			if (browserConsole.isOverridden === true) return;
			browserConsole.isOverridden = true;

			kx.iterator(['error', 'warn', 'debug', 'log', 'info']).each(function(method) {
				config[method] = browserConsole[method] || false;
				browserConsole[method] = getReplacement(method);
			});
		})();
	}

	kx.fiddleConsole = Console;
})(window, konflux);
