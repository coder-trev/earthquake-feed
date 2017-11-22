require.config({ 
	baseUrl: 'js',
	paths : { 
		jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min',
		pointfree: 'https://cdn.rawgit.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
		ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min',
		rx: 'https://cdn.rawgit.com/Reactive-Extensions/RxJS/6770d243/dist/rx.all',
		'rx.dom': 'https://cdnjs.cloudflare.com/ajax/libs/rxjs-dom/7.0.3/rx.dom.min',
		leaflet: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet'
	}
});

require(['jquery', 'app'], function($, app) {
	'use strict';

	$(app);
});