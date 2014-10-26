;(function(window, kx) {
	function Storage()
	{
		var storage = this,
			adapters = {},
			cname = null;

		function encode(data)
		{
			return btoa(JSON.stringify(data));
		}

		function decode(data)
		{
			return JSON.parse(atob(data));
		}

		function checkCompatability()
		{
			if (!window.atob || !window.btoa)
				throw new Error('Storage is not supported in this browser');
		}

		function getCname()
		{
			if (cname !== null) return cname;

			cname = false;

			kx.ajax.get({
				url: '/CNAME',
				async: false,
				success: function(status, data) {
					cname = data;
				}
			});

			return cname;
		}

		storage.load = function(args) {
			var components = args.name.split('/'),
				val, a;

			if (components.length === 2 && 'function' === typeof adapters[components[0]].load)
			{
				if ((val = adapters[components[0]].load.apply(null, components.slice(1))))
					return decode(val);
			}
			else
			{
				for (a in adapters._ordered)
				{
					if ((val = adapters._ordered[a].load.apply(null, components)))
						return decode(val);
				}
			}

			return false;
		};

		storage.save = function(args) {
			adapters.user.save(args.name, encode(args.data));
		};

		storage.list = function(args) {
			var list = {};

			if ('function' !== typeof args.callback) return;

			adapters.user.index(function(data) {
				list.stored = data;
				adapters.example.index(function(data) {
					list.examples = data;
					args.callback.call(null, list);
				});
			});
		};

		adapters.example = {
			load: function(name) {
				var contents = false;
				kx.ajax.get({
					url: adapters.example._getUrl('/' + name),
					success: function(status, data) {
						contents = data.content;
					},
					async: false
				});
				return contents;
			},
			index: function(callback) {
				kx.ajax.get({
					url: adapters.example._getUrl(),
					success: function(status, data) {
						data = kx.iterator(data).map(function(example) {
							return example.name;
						}).collection();
						data._prefix = 'example/';
						callback.call(null, data);
					},
					error: function() {
						data = [];
						data._prefix = 'example/';
						callback.call(null, data);
					}
				});
			},
			_getUrl: function(path) {
				var host = window.location.host,
					base = 'https://api.github.com/repos/{user}/konflux/contents/examples/build{path}?ref=gh-pages',
					user = 'konfirm',
					match;

				path = path || '';

				if (host !== getCname())
				{
					match = host.match(/(.*?)\.github\.io/);
					if (match) user = match[1] || user;
				}

				return base.replace('{user}', user).replace('{path}', path);
			}
		};

		adapters.querystring = {
			load: function(data) {
				var querystring;

				querystring = window.location.search.replace(/(^\?|\/$)/g, '');

				if (querystring !== '') return querystring;

				return false;
			},
			save: function (name, data) {
				return data;
			}
		};

		adapters.user = {
			load: function(name) {
				return kx.storage.get(name);
			},
			save: function(name, data) {
				return kx.storage.set(name, data);
			},
			index: function(callback) {
				var data = Object.keys(kx.storage.get());
				data._prefix = 'user/';
				callback.call(null, data);
			}
		};

		adapters._ordered = [
			adapters.user,
			adapters.example
		];

		(function init() {
			var val = adapters.querystring.load();
			if (val) kx.fiddle.display(val);
		})();
	}

	kx.fiddle.storage = new Storage();
})(window, konflux);
