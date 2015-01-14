(function($) {

	if (!window.localStorage) { return false; }

	var tzOffset = 1;

	$(document).ready(function() {

		var tpl_clock = $('#tpl_clock').html(); $('#tpl_clock').remove();
		var tpl_news = $('#tpl_news').html(); $('#tpl_news').remove();
		var tpl_todos = $('#tpl_todos').html(); $('#tpl_todos').remove();
		var tpl_links = $('#tpl_links').html(); $('#tpl_links').remove();
		var tpl_weather = $('#tpl_weather').html(); $('#tpl_weather').remove();

		if (localStorage["project-dashboard.token"]) {
			$.getJSON('http://localhost:3000/user_info',
				{token: localStorage["project-dashboard.token"]},
				function(data) {
					/* SETTING THE CLOCK */
					tzOffset = data.data.timezone;
					
					$('#your_username').text(data.data.username);
					$('#news').html(Mustache.render(tpl_news, {news: data.data.news} ));
					$('#todos').html(Mustache.render(tpl_todos, {todos: data.data.todos} ));
					$('#links').html(Mustache.render(tpl_links, {links: data.data.links} ));
				}, 'json');
		} else {
			window.location = "login.html"
		}





		var update_clock = function() {
			var d = new Date();
			var dx = d.toGMTString();
			dx = dx.substr(0, dx.length - 3);
			d.setTime(Date.parse(dx));
			d.setHours(d.getHours() + tzOffset);
			console.log(d, tzOffset);
		}
		window.setInterval(update_clock, 500);

	});

})(jQuery);