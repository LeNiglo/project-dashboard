require(['jquery', 'simpleWeather'], ($) => {

	var $weather, $weatherGeoloc, $tempIcon, $tempZone;

	function update_weather() {
		$.simpleWeather({
			location: current_location,
			unit: 'c',
			success: (weather) => {
				console.log(weather);

				$tempIcon.removeClass().addClass('icon-' + weather.code);
				$tempZone.text(weather.temp);
			},
			error: (error) => {
				console.error(error);
			}
		})
	}

	$(document).ready(() => {
		$weather = $('#weather');
		$weatherGeoloc = $weather.find('#weather-geoloc');
		$tempIcon = $weather.find('#temp-icon');
		$tempZone = $weather.find('#temp-zone');

		current_location = 'Paris';

		/* Does your browser support geolocation? */
		if ("geolocation" in navigator) {
			$weatherGeoloc.removeClass('hidden').click(function (e) {
				e.preventDefault();

				/* Where in the world are you? */
				navigator.geolocation.getCurrentPosition(function(position) {
					current_location = position.coords.latitude + ',' + position.coords.longitude;
					update_weather();
				});
			});
		}

		update_weather();
		window.setInterval(update_weather, 60000);
	});

});
