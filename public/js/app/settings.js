(function($) {

	if (!window.localStorage) {
		window.location = "about.html";
	}

	var root_url = "https://localhost:3000";

	var timezones = [
	{offset: '-12', title: 'Baker Island, Howland Island'},
	{offset: '-11', title: 'Hawaii, New Zealand, Jarvis Island'},
	{offset: '-10', title: 'Papeete, Honolulu'},
	{offset: '-09', title: 'Anchorage, Marquesas Island'},
	{offset: '-08', title: 'Los Angeles, Vancouver, Tijuana'},
	{offset: '-07', title: 'Phoenix, Calgary, Ciudad Juárez'},
	{offset: '-06', title: 'Chicago, Guatemala City, Mexico City, San José, San Salvador, Tegucigalpa, Winnipeg'},
	{offset: '-05', title: 'New York, Lima, Toronto, Bogotá, Havana, Kingston'},
	{offset: '-04', title: 'Santiago, La Paz, San Juan de Puerto Rico, Manaus, Halifax'},
	{offset: '-03', title: 'Buenos Aires, Montevideo, São Paulo'},
	{offset: '-02', title: 'Fernando de Noronha'},
	{offset: '-01', title: 'Cape Verde, Greenland'},
	{offset: '+00', title: 'London, Accra, Abidjan, Casablanca, Dakar, Dublin, Lisbon'},
	{offset: '+01', title: 'Paris, Brussels, Belgrade, Berlin, Lagos, Madrid, Rome, Tunis, Vienna, Warsaw'},
	{offset: '+02', title: 'Athens, Sofia, Cairo, Kiev, Istanbul, Beirut, Helsinki, Jerusalem, Johannesburg, Bucharest'},
	{offset: '+03', title: 'Moscow, Nairobi, Baghdad, Doha, Khartoum, Minsk, Riyadh'},
	{offset: '+04', title: 'Baku, Dubai, Samara, Muscat'},
	{offset: '+05', title: 'Karachi, Tashkent, Yekaterinburg'},
	{offset: '+06', title: 'Kathmandu, Almaty, Dhaka, Novosibirsk'},
	{offset: '+07', title: 'Jakarta, Bangkok, Krasnoyarsk, Hanoi'},
	{offset: '+08', title: 'Taipei, Perth, Beijing, Manila, Singapore, Kuala Lumpur, Denpasar, Irkutsk'},
	{offset: '+09', title: 'Seoul, Tokyo, Pyongyang, Ambon, Yakutsk'},
	{offset: '+10', title: 'Canberra, Vladivostok, Port Moresby, Hagatna'},
	{offset: '+11', title: 'Honiara, Noumea'},
	{offset: '+12', title: 'Auckland, Suva'},
	{offset: '+13', title: 'Phoenix Islands, Samoa, Tonga'},
	{offset: '+14', title: 'Line Islands'},
	];

	var tpl_links = null;

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
				localStorage["project-dashboard.color"] = data.data.color;
				$('body').css("background-color", localStorage["project-dashboard.color"]);
				$('#your_username').text(localStorage["project-dashboard.username"]);

				/* SETTING THE CLOCK */
				localStorage["project-dashboard.timezone"] = data.data.timezone;

				/* SETTING THE WEATHER */
				localStorage["project-dashboard.weather.location"] = data.data.weather.location;
				localStorage["project-dashboard.weather.unit"] = data.data.weather.unit;

				for (var i in data.data.news) {
					$('#change_news').find('textarea').append(data.data.news[i]+'\n');
				};

				tpl_links = Handlebars.compile($('#tpl_links').html());

				$('#change_links').html(tpl_links({"links": data.data.links}));

			}, 'json');
};

function get_timezones() {
	var html = '';
	for (var i in timezones) {
		html += '<option value="'+parseInt(timezones[i].offset)+'">UTC '+timezones[i].offset+' &mdash; '+timezones[i].title+'</option>';
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
	for (i in timezones) {
		if (parseInt(localStorage["project-dashboard.timezone"]) === parseInt(timezones[i].offset)) {
			$('#change_location').find('select[name="timezone"]').prop("selectedIndex", i);
			break;
		}
	}

	if (localStorage["project-dashboard.weather.unit"] === 'f') {
		$('#change_location').find('select[name="unit"]').prop("selectedIndex", 1);
	}
	$('#change_location').find('input[name="location"]').val(localStorage["project-dashboard.weather.location"]);
	$('#change_location').find('input[name="locale"]').val(localStorage["project-dashboard.locale"]);
	$('#color_picker').val(localStorage["project-dashboard.color"]).change(function(e) {
		$('body').css("background-color", $(this).val());
	});
	$('#change_color').click(function(e) {
		e.preventDefault();
		$.getJSON(root_url+'/change_color',
			{token: localStorage["project-dashboard.token"], color: $('#color_picker').val()}, function(data) {
				console.log(data);
			}, 'json');
	});
	$('#change_news').submit(function(e) {
		e.preventDefault();

		$.getJSON(root_url+'/change_news',
			{token: localStorage["project-dashboard.token"], news: $('#change_news').find("textarea").val()}, function(data) {
				console.log(data);
			}, 'json');
	});
	$('#change_location').submit(function(e) {
		e.preventDefault();
		var datas = {
			timezone: $('#change_location').find('select[name="timezone"]').val(),
			locale: $('#change_location').find('input[name="locale"]').val(),
			location: $('#change_location').find('input[name="location"]').val(),
			unit: $('#change_location').find('select[name="unit"]').val()
		};
		$.getJSON(root_url+'/change_location',
			{token: localStorage["project-dashboard.token"], timezone: datas.timezone, locale: datas.locale, location: datas.location, unit: datas.unit}, function(data) {
				console.log(data);
			}, 'json');
	});
	$('#change_password').submit(function(e) {
		e.preventDefault();
		if ($(this).find('input[name="password_n"]').val() === $(this).find('input[name="password_v"]').val()) {
			$.getJSON(root_url+'/change_password',
				{token: localStorage["project-dashboard.token"], old_pass: md5($(this).find('input[name="password"]').val()), new_pass: md5($(this).find('input[name="password_n"]').val())}, function(data) {
					console.log(data);
				}, 'json');
		} else {
			$(this).find('input[name="password_v"]').val("");
			$(this).find('input[name="password_n"]').focus();
			alert('Password didn\'t match !');
		}
	});

});

})(jQuery);