;(function(window, kx) {
	function Storage()
	{
		var storage = this,
			adapters = {};

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

		storage.load = function(args) {
			var components = args.name.split('/'),
				val, a;

			if (components.length === 2 && 'function' === typeof adapters[components[0]])
			{
				if (val = adapters[components[0]].apply(null, components.slice(1)))
					return decode(val);
			}
			else
			{
				for (a in adapters._ordered)
				{
					if (val = adapters._ordered[a].apply(null, components))
						return decode(val);
				}
			}

			return false;
		};

		storage.save = function(args) {
			adapters.user(args.name, args.data);
		};

		adapters.example = function(name)
		{
			return false;
		}

		adapters.querystring = function(data)
		{
			var querystring;

			if (data)
				return encode(data);

			querystring = window.location.search.replace(/(^\?|\/$)/g, '');

			if (querystring !== '') return decode(querystring);

			return false;
		}

		adapters.user = function(name, data)
		{
			if (data)
				return kx.storage.set(name, encode(data));

			return kx.storage.get(name);
		}

		adapters._ordered = [
			adapters.user,
			adapters.example
		];

		(function init() {
			var val = adapters.querystring();
			if (val) kx.fiddle.display(val);
		})();
	}

	kx.fiddle.storage = new Storage();
})(window, konflux);
