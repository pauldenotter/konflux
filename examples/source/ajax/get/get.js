var imageList = document.getElementById('images');

kx.ajax.get({
    url: 'https://unsplash.it/list',
    success: function(status, data) {
        kx.iterator(data).each(function(item) {
            var imageListItem = document.createElement('li'),
                imageListItemLink = document.createElement('a');

            imageListItemLink.appendChild(document.createTextNode(
                item.author + ' - ' + item.filename
            ));
            imageListItemLink.setAttribute('href', item.post_url);
            imageListItemLink.setAttribute('target', '_blank');

            imageListItem.appendChild(imageListItemLink);
            imageList.appendChild(imageListItem);
        });
    }
});
