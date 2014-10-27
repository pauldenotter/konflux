;(function(window, kx) {
	'use strict';

	function Drawer()
	{
		var drawer = this,
			drawers;

		drawer.show = function(name) {
			if (!name in drawers)
				throw new Error('Drawer does not exist');

			if ('function' === typeof drawers[name].beforeshow)
			{
				drawers[name].beforeshow.call(drawer, function() {
					kx.style.addClass(drawers[name].el, 'active');
				});
			}
			else
			{
				kx.style.addClass(drawers[name].el, 'active');
			}
		};

		drawer.hide = function(name) {
			if (!name in drawers)
				throw new Error('Drawer does not exist');

			kx.style.removeClass(drawers[name].el, 'active');
		};

		(function init() {
			drawers = {
				list: {
					el: document.getElementById('drawerList'),
					beforeshow: function(callback) {
						kx.fiddle.storage.list({callback: function(data) {

							while (drawers.list.el.firstChild)
								drawers.list.el.removeChild(drawers.list.el.firstChild);

							kx.iterator(data).each(function(list) {
								var type = document.createElement('li'),
									listEl = document.createElement('ul');
								type.appendChild(document.createTextNode(list._prefix));
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
				}
			};
		})();
	}

	kx.fiddle.drawer = new Drawer();
})(window, konflux);
