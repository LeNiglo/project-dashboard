require(['javascripts/config.js'], () => {

	require(['javascripts/search.js', 'javascripts/clock.js', 'javascripts/weather.js']);

	require(['jquery'], ($) => {
		$(document).ready(() => {
			console.log($.fn.jquery);
		});
	});
});
