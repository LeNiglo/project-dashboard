(function($) {

	voice_recognition = function() {

		$('#g_search').attr("placeholder", 'Say "Okay Dashboard !"');

		var recognition = new webkitSpeechRecognition();
		var final_transcript = '';
		var start_recording = false;
		recognition.continuous = true;
		recognition.interimResults = true;
		console.log('locale :', recognition.lang = localStorage["project-dashboard.locale"]);

		recognition.onstart = function() {
			console.log("Starting recognition.");
		}
		recognition.onresult = function(event) {
			var interim_transcript = '';

			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					final_transcript += event.results[i][0].transcript;
				} else {
					interim_transcript += event.results[i][0].transcript;
				}
			}
			final_transcript = final_transcript;
			if (start_recording === false) {
				if (interim_transcript === "ok dashboard" || interim_transcript === "okay dashboard") {
					start_recording = true;
					final_transcript = '';
					interim_transcript = '';
					alert("Now Recording.");
				} else {
					console.log("N-Final : ", final_transcript);
					console.log("N-Inter : ", interim_transcript);
				}
			} else {
				$('#g_search').val(final_transcript);
				console.log("R-Final : ", final_transcript);
				console.log("R-Inter : ", interim_transcript);
			}
		};
		recognition.onerror = function(event) {
			console.log("Error.");
		}
		recognition.onend = function() {
			console.log("Ended.");
		}

		recognition.start();

	};
})(jQuery);