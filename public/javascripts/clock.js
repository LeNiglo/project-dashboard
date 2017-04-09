require(['jquery', 'moment_tz'], ($, moment) => {

	var $clock, $timeZone, $dateZone, lastMoment;

	function load_timezone(tz, cb) {
		if (moment.tz.zone(current_timezone) === null) {
			$.get({
				url: moment_tz_data,
				cache: true
			}).then((data) => {
				for (var idx in data.zones) {
					if (data.zones[idx].startsWith(tz)) {
						moment.tz.add(data.zones[idx]);
						break;
					}
				}
				return cb ? cb(true) : true;
			});
		} else {
			return cb ? cb(false) : false;
		}
	}

	function update_clock() {
		load_timezone(current_timezone, () => {
			var now = moment().tz(current_timezone);
			if (!lastMoment || lastMoment.minutes() !== now.minutes() || lastMoment.hours() !== now.hours()) {
				$timeZone.text(now.format('H:mm'));
				$dateZone.text(now.format('LL'));
			}
			lastMoment = now;
		});
	}

	$(document).ready(() => {
		$clock = $('#clock');
		$timeZone = $clock.find('#time-zone');
		$dateZone = $clock.find('#date-zone');

		current_timezone = localStorage.getItem('timezone') !== null ? localStorage.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone;

		update_clock();
		window.setInterval(update_clock, 2000);

	});
});
