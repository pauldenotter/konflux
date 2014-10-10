;(function(window, kx) {
	'use strict';

	function kxFiddle()
	{
		var fiddle = this,
			editors = {},
			_console = document.getElementById('console'),
			_instructions = {
				javascript: {
					mime: 'text/javascript',
					parent: 'body',
					tag: 'script'
				},
				css: {
					mime: 'text/css',
					parent: 'head',
					tag: 'style'
				}
			};

		function inject(sandbox, type)
		{
			var code = getValue(type),
				el = sandbox.createElement(_instructions[type].tag);

			el.type = _instructions[type].mime;

			try
			{
				el.appendChild(sandbox.createTextNode(code));
			}
			catch (e)
			{
				el.text = code;
			}

			sandbox[_instructions[type].parent].appendChild(el);
		}

		function initDependencies(sandbox, callback)
		{
			var el = sandbox.contentDocument.createElement('script');
			sandbox.contentDocument.body.appendChild(el);
			if ('function' === typeof callback) el.onload = callback;
			el.src = 'vendor/konfirm/konflux/konflux.js';
		}

		function getValue(mode)
		{
			return editors[mode].getValue();
		}

		fiddle.display = function(data) {
			var type;

			if (!data) return;

			for (type in data)
				editors[type].setValue(data[type], 1);
		};

		fiddle.load = function(args) {
			fiddle.display(fiddle.storage.load(args));
		};

		fiddle.save = function(args) {
			var name = args.name || prompt('Save as'),
				data = {};

			kx.iterator(editors).each(function(editor, key) {
				data[key] = editor.getValue();
			});

			fiddle.storage.save({
				name: name,
				data: data
			});
		}

		fiddle.run = function(args) {
			var container = document.getElementById('sandbox'),
				el = document.createElement('iframe'),
				sandbox = {
					win: el.contentWindow,
					doc: el.contentDocument
				};

			// renew sandbox frame
			while (container.firstChild)
				container.removeChild(container.firstChild);

			// clear console
			while (_console.firstChild)
				_console.removeChild(_console.firstChild);

			container.appendChild(el);

			kx.fiddle.console.bind(el, _console);

			// add CSS
			inject(el.contentDocument, 'css');

			// add HTML
			el.contentDocument.body.innerHTML = getValue('html');

			// add JavaScript
			initDependencies(el, function() {
				inject(el.contentDocument, 'javascript');
			});
		};

		(function init() {
			kx.iterator(['html', 'css', 'javascript']).each(function(mode) {
				var editor = ace.edit('ace-' + mode);
				editor.setTheme('ace/theme/monokai');
				editor.getSession().setMode('ace/mode/' + mode);
				editor.setOptions({
					enableBasicAutocompletion: true
				});
				editors[mode] = editor;
			});
		})();
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
