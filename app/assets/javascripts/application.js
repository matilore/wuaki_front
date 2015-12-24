// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .


function postAjax(url, data) {
	return $.ajax({
		url: url,
		type: 'POST',
		dataType: "json",
		data: data,
		error: handleError
	})
}

function handleError(req, status, error) {
	console.log("there has been an  error " + error);
}


function handleSuccess(data) {
	var token = data.auth_token;
	window.localStorage.setItem('token', token);
}

function sendParamsLogin() { //mandare params a controller sessions di wuaki api
	$('.btn-formSessions').click(function(event) {
		event.preventDefault();
		var email = $('#email').val();
		var password = $('#password').val();

		var credentials = {
					email: email,
					password: password
				};
		var data = {data_value: JSON.stringify(credentials)};
		
		var sendCredentials = postAjax('http://localhost:3000/v1/sessions', data);



		$.when(sendCredentials).done(function(respSendCredentials) {
		handleSuccess(respSendCredentials);
		});

		// $.ajax({
		// 		url : 'http://localhost:3000/v1/sessions',
		// 		type : 'POST',
		// 		dataType: 'json',
		// 		data : {data_value: JSON.stringify(credentials)},
		// 	});
	});
}

function logOut() {
	$('.btn-logOut').click(function(event) {
		event.preventDefault();
		var auth_token_val = window.localStorage.getItem('token');

	$.ajax({
		url : 'http://localhost:3000/v1/sessions/' + auth_token_val,
		type : 'DELETE'
	});
});
};


$( document ).ready(function() {
    sendParamsLogin();
    logOut();

});
