;(function(window, kx) {
	'use strict';

	function Hinter()
	{
		var hinter = this,
			output = document.getElementById('hinter'),
			config, global;

		function format(error)
		{
			return 'line ' + error.line + ': ' + error.reason;
		}

		hinter.hint = function(code) {
			while (output.firstChild)
				output.removeChild(output.firstChild);

			if (!JSHINT(code, config, global))
			{
				kx.iterator(JSHINT.errors).each(function(error) {
					var el = document.createElement('li');
					el.appendChild(document.createTextNode(format(error)));
					output.appendChild(el);
				});
			}
		};
	}

	kx.fiddleHinter = new Hinter();
})(window, konflux);
