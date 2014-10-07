;(function(window, kx) {
	'use strict';

	function kxFiddle()
	{
		var fiddle = this,
			_instructions = {
				script: {
					mime: 'text/javascript',
					el: 'body'
				},
				style: {
					mime: 'text/css',
					el: 'head'
				}
			};

		function clearSandbox(sandbox)
		{
			kx.iterator(sandbox.querySelectorAll('[data-kx-fiddle-child]')).each(function(el) {
				el.parentElement.removeChild(el);
			});
		}

		function inject(sandbox, type)
		{
			var code = getValue(type),
				el = sandbox.createElement(type);

			el.type = _instructions[type].mime;
			el.dataset.kxFiddleChild = 'true';
			try
			{
				el.appendChild(sandbox.createTextNode(code));
			}
			catch (e)
			{
				el.text = code;
			}
			sandbox[_instructions[type].el].appendChild(el);
		}

		function initKx(sandbox, callback)
		{
			var el = sandbox.createElement('script');
			el.dataset.kxFiddleChild = 'true';
			sandbox.body.appendChild(el);
			if ('function' === typeof callback) el.onload = callback;
			el.src = 'script/konflux.js';
		}

		function getValue(type)
		{
			return kx.dom.select('textarea[name=' + type + ']')
				.map(function(el) {
					return el.value.trim();
				})
				.collection()
				.join('\n')
			;
		}

		fiddle.run = function(args) {
			var sandbox = document.getElementById('sandbox').contentDocument;

			console.log('Running fiddle');
			clearSandbox(sandbox);

			// add CSS
			inject(sandbox, 'style');

			// add HTML
			htmlEl = sandbox.createElement('div');
			htmlEl.dataset.kxFiddleChild = 'true';
			htmlEl.innerHTML = getValue('html')
			sandbox.body.appendChild(htmlEl);

			// add JavaScript
			initKx(sandbox, function() {
				inject(sandbox, 'script');
			});
		};
	}

	kx.fiddle = new kxFiddle();

	// bind eventhandlers
	kx.event.add(document.body, ['touchstart', 'click'], '[data-action]', function(e) {
		var element = this,
			args = element.dataset,
			action = args.action.split('.'),
			part, method;

		args = kx.iterator(args);

		while (part = action.shift())
		{
			if (!method)
			{
				method = window[part];
				continue;
			}

			method = method[part];
		}

		method.call({}, args);
	});
})(window, konflux);
