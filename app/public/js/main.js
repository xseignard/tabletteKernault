(function($) {
	var width = 320;
	var height = 240;

	var video, canvas, data, photo, startButton, uploadButton;

	var startup = function() {
		video = document.getElementById('video');
		canvas = document.getElementById('canvas');
		photo = document.getElementById('photo');
		startButton = document.getElementById('startButton');
		uploadButton = document.getElementById('uploadButton');

		video.setAttribute('width', width);
		video.setAttribute('height', height);
		photo.setAttribute('width', width);
		photo.setAttribute('height', height);
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		navigator.webkitGetUserMedia(
			{video: true},
			function(stream) {
				video.src = window.URL.createObjectURL(stream);
			},
			function(err) {
				console.log('An error occured! ' + err);
			}
		);

		startButton.onclick = function(ev) {
			takePicture();
			ev.preventDefault();
		};

		uploadButton.onclick = function(ev) {
			uploadPicture();
			ev.preventDefault();
		};
	};

	var takePicture = function() {
		var context = canvas.getContext('2d');
		canvas.width = width;
		canvas.height = height;
		context.drawImage(video, 0, 0, width, height);
		data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
	};

	var uploadPicture = function() {
		$.post('api/photo', { img: data.replace(/^data:image\/png;base64,/, '') }, function(res) {
			console.log(res);
		});
	};

	window.addEventListener('load', startup);
})(jQuery);
