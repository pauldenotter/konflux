;(function(window, kx) {
	'use strict';

	function Drawer()
	{
		var drawer = this,
			drawers;

		drawer.show = function(args) {
			var _drawer = getDrawer(args.name);

			_drawer.visible = true;
			if ('function' === typeof _drawer.beforeshow)
			{
				_drawer.beforeshow.call(drawer, function() {
					kx.style.addClass(_drawer.el, 'active');
				});
			}
			else
			{
				kx.style.addClass(_drawer.el, 'active');
			}
		};

		drawer.hide = function(args) {
			var _drawer = getDrawer(args.name);
			kx.style.removeClass(_drawer.el, 'active');
			_drawer.visible = false;
		};

		drawer.peak = function(args) {
			var _drawer = getDrawer(args.name),
				_animationEnd;
			if (_drawer.visible || Array.prototype.slice.call(_drawer.el.classList).indexOf('peak') >= 0)
				return;

			_animationEnd = function() {
				kx.event.remove(_drawer.el, 'animationend', _animationEnd);
				setTimeout(function() {
					kx.style.removeClass(_drawer.el, 'peak');
				}, 2000);
			};

			kx.event.add(_drawer.el, 'animationend', _animationEnd);
			kx.style.addClass(_drawer.el, 'peak');
		};

		drawer.toggle = function(args) {
			drawer[(getDrawer(args.name).visible ? 'hide' : 'show')](args);
		};

		drawer.isVisible = function(args) {
			return getDrawer(args.name).visible;
		};

		drawer.hideAll = function() {
			var name;
			for (name in drawers) {
				drawer.hide({name: name});
			}
		};

		function getDrawer(name)
		{
			if (!(name in drawers))
				throw new Error('Drawer does not exist');

			return drawers[name];
		}

		(function init() {
			drawers = {
				list: {
					el: document.getElementById('drawerList'),
					visible: false,
					beforeshow: function(callback) {
						kx.fiddle.storage.list({callback: function(data) {

							while (drawers.list.el.firstChild)
								drawers.list.el.removeChild(drawers.list.el.firstChild);

							kx.iterator(data).each(function(list) {
								var type = document.createElement('li'),
									listEl = document.createElement('ul');
								type.appendChild(document.createTextNode(list._prefix.slice(0, -1)));
								type.appendChild(listEl);

								kx.iterator(list).each(function(item) {
									var itemEl = document.createElement('li');
									itemEl.appendChild(document.createTextNode(item));
									itemEl.dataset.action = 'kx.fiddle.load';
									itemEl.dataset.name = list._prefix + item;
									listEl.appendChild(itemEl);
								});

								drawers.list.el.appendChild(type);
							});

							callback();
						}});
					}
				},
				console: {
					el: document.getElementById('console'),
					visible: false
				}
			};
		})();
	}

	kx.fiddle.drawer = new Drawer();
})(window, konflux);
