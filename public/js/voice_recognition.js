(function($) {

	voice_recognition = function() {

		var old_placeholder = $('#g_search').attr("placeholder");

		var recognition = new webkitSpeechRecognition();
		var final_transcript = '';
		var is_recording = false;
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = localStorage["project-dashboard.locale"];

		recognition.onstart = function() {
			console.log("SpeechRecognition Started.");
			$('#g_search').attr("placeholder", 'Say "Okay Dashboard !"');
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
			if (is_recording === false) {
				if (interim_transcript.indexOf("ok dashboard") > -1 || interim_transcript.indexOf("okay dashboard") > -1) {
					final_transcript = '';
					interim_transcript = '';
					is_recording = true;
					$('#g_search').addClass('hidden');
					$('#final_span').parent().removeClass('hidden');
				}
			} else {
				//$('#g_search').val(final_transcript + interim_transcript);
				final_transcript = capitalize(final_transcript);
				$('#final_span').html(linebreak(final_transcript));
				$('#inter_span').html(linebreak(interim_transcript));
			}
		};
		recognition.onerror = function(event) {
			is_recording = false;
			$('#g_search').removeClass('hidden');
			$('#final_span').parent().addClass('hidden');
			$('#g_search').attr("placeholder", old_placeholder);
			console.log("Error.", event);
		}
		recognition.onend = function() {
			is_recording = false;
			if (is_recording === true)
				window.location = "https://www.google.com#q="+$('#final_span').html();
			else
				console.log("SpeechRecognition Ended.");
			$('#g_search').removeClass('hidden');
			$('#final_span').parent().addClass('hidden');
			$('#g_search').attr("placeholder", old_placeholder);
		}

		recognition.start();


	};

	var two_line = /\n\n/g;
	var one_line = /\n/g;
	function linebreak(s) {
		return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
	}
	var first_char = /\S/;
	function capitalize(s) {
		return s.replace(first_char, function(m) { return m.toUpperCase(); });
	}
})(jQuery);