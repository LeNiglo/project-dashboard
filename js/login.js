(function($) {

	if (!window.localStorage) {
		window.location = "about.html";
	}

	$(document).ready(function() {

		/* Choose What To Display */
		if (localStorage["project-dashboard.token"]) {
			$("#show_logged").removeClass('hidden');
		} else {
			$("#show_login").removeClass('hidden');
		}

		/* Connection */
		$('#login').submit(function(e) {
			e.preventDefault();
			var $this = {
				email: $(e.target).find('input[name="email"]').val(),
				password: md5($(e.target).find('input[name="password"]').val())
			};

			$.getJSON('http://localhost:3000/login',
				$this, function(data) {
					if (typeof data.data === 'string') {
						localStorage["project-dashboard.token"] = data.data;
						window.location = ".";
					} else if (data.data === false) {
						$(e.target).find('input[name="password"]').val("");
						$(e.target).find('input[name="password"]').focus();
						alert("Wrong Password.");
					} else if (data.data === null) {
						$('#register').find('input[name="email"]').focus();
						alert("Email or Username don't exists.");
					} else {
						alert("Error while logging in. :(");
					} }, 'json');
		});

		/* Registration */
		$('#register').submit(function(e) {
			e.preventDefault();
			if ($(e.target).find('input[name="password"]').val() === $(e.target).find('input[name="password_v"]').val()) {
				var $this = {
					email: $(e.target).find('input[name="email"]').val(),
					username: $(e.target).find('input[name="username"]').val(),
					password: md5($(e.target).find('input[name="password"]').val())
				};

				$.getJSON('http://localhost:3000/register',
					$this, function(data) {
						if (typeof data.data === 'string') {
							localStorage["project-dashboard.token"] = data.data;
							window.location = "settings.html";
						} else if (data.data === null) {
							alert("Email or Username allready exists.");
						} else {
							alert("Error while registering. :(");
						} }, 'json');
			} else {
				$(e.target).find('input[name="password_v"]').val("");
				$(e.target).find('input[name="password"]').focus();
				alert('Password didn\'t match !');
			}
		});
	});

})(jQuery);