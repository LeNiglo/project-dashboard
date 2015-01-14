(function($) {

	if (!window.localStorage) { return false; }

	$(document).ready(function() {

		if (localStorage["project-dashboard.token"]) {
			console.log($("#show_logged").removeClass('hidden'));
		} else {
			console.log($("#show_login").removeClass('hidden'));
		}

		$('#register').submit(function(e) {
			e.preventDefault();
			var $this = {
				email: $(e.target).find('input[name="email"]').val(),
				username: $(e.target).find('input[name="username"]').val(),
				password: $(e.target).find('input[name="password"]').val()
			};

			if ($this.password === $(e.target).find('input[name="password_v"]').val()) {
				$.getJSON('http://localhost:3000/register',
				$this,
				function(data) {
					localStorage["project-dashboard.token"] = data.data;
				}, 'json');
			} else {
				$(e.target).find('input[name="password_v"]').val("");
				$(e.target).find('input[name="password"]').focus();
				alert('Password didn\'t match !');
			}
		});
	});

})(jQuery);