(function($) {

	if (!window.localStorage) { return false; }

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
				password: $(e.target).find('input[name="password"]').val()
			};

			console.log($this);
		});

		/* Registration */
		$('#register').submit(function(e) {
			e.preventDefault();
			var $this = {
				email: $(e.target).find('input[name="email"]').val(),
				username: $(e.target).find('input[name="username"]').val(),
				password: $(e.target).find('input[name="password"]').val()
			};

			if ($this.password === $(e.target).find('input[name="password_v"]').val()) {
				$.getJSON('http://localhost:3000/register',
					$this, function(data) {
						if (typeof data.data === 'string') {
							localStorage["project-dashboard.token"] = data.data;
							window.location = "settings.html";
						} else if (data.data === null) {
							alert("Email or Username allready exists.");
						} else {
							alert("Error while registering :(");
						} }, 'json');
			} else {
				$(e.target).find('input[name="password_v"]').val("");
				$(e.target).find('input[name="password"]').focus();
				alert('Password didn\'t match !');
			}
		});
	});

})(jQuery);