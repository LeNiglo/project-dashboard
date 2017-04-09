require(['jquery'], ($) => {

	$(document).ready(() => {
		$('input#google-search').keypress(function (e) {
			if ([9, 13].indexOf(e.which) !== -1) {
				e.preventDefault();
				var query = $(this).val();
				if (query.length > 0) {
					var url = "https://www.google.com#q=" + query;
					console.log(url);
					// window.location = url;
				}
			}
		});
	});

});
