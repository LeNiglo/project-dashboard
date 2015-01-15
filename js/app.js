(function($) {

	if (!window.localStorage) { return false; }

	var tpl_clock = null;
	var tpl_news = null;
	var tpl_todos = null;
	var tpl_links = null;
	var tpl_weather = null;
	var root_url = "http://localhost:3000";

	var update_clock = function() {
		var d = moment().utcOffset(parseInt(localStorage["project-dashboard.timezone"]));
		var hours = ("0" + d.hours()).slice(-2);
		var minutes = ("0" + d.minutes()).slice(-2);
		var seconds = ("0" + d.seconds()).slice(-2);

		$('#clock').html(Mustache.render(tpl_clock, {
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			date: d.format('dddd Do YYYY')
		} ));
	};

	var update_weather = function() {
		$.simpleWeather({
			location: localStorage["project-dashboard.weather.location"],
			woeid: '',
			unit: localStorage["project-dashboard.weather.unit"],
			success: function(weather) {
				console.log(weather);
				$("#weather").html(Mustache.render(tpl_weather, {today: weather, tomorrow: weather.forecast[0]} ));
			},
			error: function(error) {
				$("#weather").html(Mustache.render(tpl_weather, {} ));
			}
		});
	};

	var refresh_info = function() {
		$.getJSON(root_url+'/user_info',
			{token: localStorage["project-dashboard.token"]},
			function(data) {
				if (data.data == null) {
					localStorage.removeItem("project-dashboard.token");
					window.location = "login.html";
				}

				/* SETTING THE WELCOME MESSAGE */
				localStorage["project-dashboard.username"] = data.data.username;
				$('#your_username').text(localStorage["project-dashboard.username"]);

				/* SETTING THE CLOCK */
				localStorage["project-dashboard.timezone"] = data.data.timezone;
				update_clock();

				/* SETTING THE WEATHER */
				localStorage["project-dashboard.weather.location"] = data.data.weather.location;
				localStorage["project-dashboard.weather.unit"] = data.data.weather.unit;
				update_weather();


				/* LOADING NEWS, TODOS, LINKS */
				$('#news').html(Mustache.render(tpl_news, {news: data.data.news} ));
				$('#todos').html(Mustache.render(tpl_todos, {todos: data.data.todos} ));
				$('#links').html(Mustache.render(tpl_links, {links: data.data.links} ));
			}, 'json');
	};


	$(document).ready(function() {

		tpl_clock = $('#tpl_clock').html(); $('#tpl_clock').remove();
		tpl_news = $('#tpl_news').html(); $('#tpl_news').remove();
		tpl_todos = $('#tpl_todos').html(); $('#tpl_todos').remove();
		tpl_links = $('#tpl_links').html(); $('#tpl_links').remove();
		tpl_weather = $('#tpl_weather').html(); $('#tpl_weather').remove();

		if (localStorage["project-dashboard.token"]) {
			refresh_info();
		} else {
			window.location = "login.html";
		}

		$('#your_username').text(localStorage["project-dashboard.username"]);

		$('#g_search').keypress(function (e) {
			if (e.which == 13) {
				var query = $(this).val();
				console.log("Google Search : '"+query+"'.");
				window.location = "https://www.google.com#q="+query;
			}
		});

		/* Refresh clock in Real Time */
		window.setInterval(update_clock, 500);
		/* Refresh User Informations every 5 minutes */
		window.setInterval(refresh_info, 300000);
		/* Refresh Weather every 5 minutes */
		window.setInterval(update_weather, 300000);

		$("#g_search").focus();
	});

})(jQuery);