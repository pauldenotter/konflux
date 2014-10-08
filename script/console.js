;(function(window, kx) {
	'use strict';

	function Console()
	{
		var _console = this;

		function getReplacement(type, outputEl, originalFunction)
		{
			return function() {
				if ('function' === typeof originalFunction)
					originalFunction.apply(this, arguments);

				logMessage(type, arguments, outputEl);
			};
		}

		function logMessage(type, args, outputEl)
		{
			var msgEl = document.createElement('li'),
				msgPre = document.createElement('pre'),
				msgTxt = document.createTextNode(kx.iterator(Array.prototype.slice.call(args)).map(function(arg) {
					switch(typeof arg)
					{
						case 'object':
							if (arg instanceof Error || arg.constructor.name === 'Error')
								return formatError(arg);

							return JSON.stringify(arg, null, '\t');

						case 'null':
							return 'null';

						default:
							return arg;
					}
				}).collection().join(' '));

			msgPre.appendChild(msgTxt);
			msgEl.setAttribute('class', type);
			msgEl.setAttribute('data-date', (new Date).toString().replace(/([0-2][0-9]\:[0-5][0-9]\:[0-5][0-9]).*/, '$1'));
			msgEl.appendChild(msgPre);
			outputEl.appendChild(msgEl);
		}

		function formatError(error)
		{
			if (error.stack)
				return error.stack.replace(/\n\s+at inject.*?\/script\/fiddle\.js[\s\S]+/im, '');

			return error.toString();
		}

		_console.bind = function(sandbox, outputEl) {
			var _window = sandbox.contentWindow;

			_window.onerror = function(message, filename, lineno, colno, error) {
				_window.console.error(error || new Error(message, filename, lineno));
			};

 			kx.iterator(['error', 'warn', 'debug', 'log', 'info']).each(function(type) {
	 			var originalFunction = _window.console && _window.console[type] ?
	 				_window.console[type] : false
	 			;
				_window.console[type] = getReplacement(type, outputEl, originalFunction);
 			});
		};
	}

	kx.console = new Console();
})(window, konflux);
