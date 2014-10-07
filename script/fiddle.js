;(function(window, kx) {
	'use strict';

	function kxFiddle()
	{
		var fiddle = this,
			_console = document.getElementById('console'),
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

			if (type === 'script')
				kx.fiddleHinter.hint(code);

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

		function initDependencies(sandbox, callback)
		{
			var el = sandbox.doc.createElement('script');
			el.dataset.kxFiddleChild = 'true';
			sandbox.doc.body.appendChild(el);
			el.onload = function() {
				var el = sandbox.doc.createElement('script');
				el.dataset.kxFiddleChild = 'true';
				sandbox.doc.body.appendChild(el);
				el.onload = function() {
					new sandbox.win.kx.fiddleConsole(
						sandbox.win.console,
						_console
					);

					if ('function' === typeof callback) callback.call();
				};
				el.src = 'script/console.js';
			};
			el.src = 'script/konflux.js';
		}

		function getValue(type)
		{
			var result = '';

			if (type === 'script')
				result += ';(function() {\n';

			result += kx.dom.select('textarea[name=' + type + ']')
				.map(function(el) {
					return el.value.trim();
				})
				.collection()
				.join('\n')
			;

			if (type === 'script')
				result += '\n})();\n';

			return result;
		}

		fiddle.run = function(args) {
			var el = document.getElementById('sandbox'),
				sandbox = {
					win: el.contentWindow,
					doc: el.contentDocument
				},
				htmlEl;

			// clear console
			while (_console.firstChild)
				_console.removeChild(_console.firstChild);

			console.log('Running fiddle');
			clearSandbox(sandbox.doc);

			// add CSS
			inject(sandbox.doc, 'style');

			// add HTML
			htmlEl = sandbox.doc.createElement('div');
			htmlEl.dataset.kxFiddleChild = 'true';
			htmlEl.innerHTML = getValue('html')
			sandbox.doc.body.appendChild(htmlEl);

			// add JavaScript
			initDependencies(sandbox, function() {
				inject(sandbox.doc, 'script');
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
	}).add(window, ['keydown'], function(e) {
		if (e.keyCode === 13 && (e.metaKey || e.ctrlKey))
		{
			kx.fiddle.run.call();
		}
	});
})(window, konflux);
