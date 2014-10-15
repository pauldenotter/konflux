var result = document.getElementById('result');
kx
	.iterator(['list item 1', 'list item 2', 'list item 3', 'Konflux is the bomb'])
	.each(function(value, key, iterator) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(value));
		result.appendChild(li);
	});
