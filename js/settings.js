(function($) {

	if (!window.localStorage) {
		window.location = "about.html";
	}

	var root_url = "http://localhost:3000";

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

				/* SETTING THE WEATHER */
				localStorage["project-dashboard.weather.location"] = data.data.weather.location;
				localStorage["project-dashboard.weather.unit"] = data.data.weather.unit;
			}, 'json');
	};

	function get_timezones() {
		var html = '';
		for (var i = -12; i <= 14; ++i) {
			if (i >= 0) {
				html += '<option value="'+i+'">UTC +'+i+'</option>';	
			} else {
				html += '<option value="'+i+'">UTC '+i+'</option>';	
			}
		};
		return html;
	};

	$(document).ready(function() {

		if (localStorage["project-dashboard.token"]) {
			$.getJSON(root_url+'/login',
				{token: localStorage["project-dashboard.token"]}, function(data) {
					if (data.data === true) {
						refresh_info();
					} else {
						localStorage.clear();
						window.location = "login.html";
					} }, 'json');
		} else {
			window.location = "login.html";
		}

		$('#your_username').text(localStorage["project-dashboard.username"]);

		$('#logout').click(function(e) {
			e.preventDefault();
			localStorage.clear();
			window.location = "login.html";
		});

		$('#change_location').find('select[name="timezone"]').html(get_timezones());

	});

})(jQuery);