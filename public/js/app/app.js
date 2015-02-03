(function($) {

	if (!window.localStorage) {
		window.location = "about.html";
	}

	var tpl_clock = null;
	var tpl_news = null;
	var tpl_todos = null;
	var tpl_links = null;
	var tpl_weather = null;
	var root_url = "https://localhost:3000";


	var last_clock = null;
	var update_clock = function() {
		var d = moment().utcOffset(parseInt(localStorage["project-dashboard.timezone"]));
		if (d.minutes() != last_clock) {

			last_clock = d.minutes()
			var hours = ("0" + d.hours()).slice(-2);
			var minutes = ("0" + d.minutes()).slice(-2);
			var seconds = ("0" + d.seconds()).slice(-2);


			$('#clock').html(tpl_clock({
				hours: hours,
				minutes: minutes,
				seconds: seconds,
				date: d.format('ddd Do MMM YYYY (Z)')
			}));
		}
	};

	var update_weather = function() {
		$.simpleWeather({
			location: localStorage["project-dashboard.weather.location"],
			woeid: '',
			unit: localStorage["project-dashboard.weather.unit"],
			success: function(weather) {
				$("#weather").html(tpl_weather({today: weather, tomorrow: weather.forecast[0]}));
			},
			error: function(error) {
				$("#weather").html(tpl_weather({}));
			}
		});
	};

	var update_feeds = function() {
		$.getJSON(root_url+'/get_feeds',
			{token: localStorage["project-dashboard.token"]},
			function(data) {
				data.data.forEach(function (e) { e.date = moment(e.date).fromNow(); });
				$('#news').html(tpl_news({news: data.data}));
			}, 'json');
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
				localStorage["project-dashboard.color"] = data.data.color;
				$('body').css("background-color", localStorage["project-dashboard.color"]);

				/* SETTING THE CLOCK */
				localStorage["project-dashboard.timezone"] = data.data.timezone;
				localStorage["project-dashboard.locale"] = data.data.locale;
				update_clock();

				/* SETTING THE WEATHER */
				localStorage["project-dashboard.weather.location"] = data.data.weather.location;
				localStorage["project-dashboard.weather.unit"] = data.data.weather.unit;
				update_weather();

				/* LOADING NEWS, TODOS, LINKS */
				update_feeds();
				$('#todos').html(tpl_todos({todos: data.data.todos}));
				$('#links').html(tpl_links({links: data.data.links}));
			}, 'json');
};


$(document).ready(function() {

	tpl_clock = Handlebars.compile($('#tpl_clock').html());
	tpl_news = Handlebars.compile($('#tpl_news').html());
	tpl_todos = Handlebars.compile($('#tpl_todos').html());
	tpl_links = Handlebars.compile($('#tpl_links').html());
	tpl_weather = Handlebars.compile($('#tpl_weather').html());

	if (localStorage["project-dashboard.token"]) {
		refresh_info();
		/* BETA */
		if (window.webkitSpeechRecognition) {
			voice_recognition();
		}
	} else {
		window.location = "login.html";
	}

	$('#your_username').text(localStorage["project-dashboard.username"]);

	$('#news').html(tpl_news({news: null}));

	$('#g_search').keypress(function (e) {
		if (e.which == 13) {
			var query = $(this).val();
			console.log("Google Search : '"+query+"'.");
			window.location = "https://www.google.com#q="+query;
		}
	}).focus();

	$('#logout').click(function(e) {
		e.preventDefault();
		localStorage.clear();
		window.location = "login.html";
	});

	/* Refresh clock in Real Time */
	window.setInterval(update_clock, 1000);
	/* Refresh feeds in Real Time */
	window.setInterval(update_feeds, 30000);
	/* Refresh User Informations every 5 minutes */
	window.setInterval(refresh_info, 300000);
	/* Refresh Weather every 5 minutes */
	window.setInterval(update_weather, 300000);

});

})(jQuery);