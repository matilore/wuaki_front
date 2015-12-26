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
//= require bootstrap-sprockets
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
	});
}

function logOut() {
	$('.btn-logOut').click(function(event) {
		event.preventDefault();
		var auth_token_val = window.localStorage.getItem('token');

		$.ajax({
			url : 'http://api.wuaki.dev:3000/v1/sessions/' + auth_token_val,
			type : 'DELETE'
		});
	});
};

//MOVIES.JS //////////////////////////////////////////////////////////////////////////////////////////////////////////////


function loadMovies() {

	function loadajax(callback){
	  $.ajax({ 
	    url:'http://api.wuaki.dev:3000/v1/movies',
	    dataType:"json",
	    type:"GET",
	    success: function(data) {
	    	callback(data)
	    }
	  });
	}

	function showMovies (data) {
			for(var i = 0; i <= data.movies.length -1; i++) {
				$(document.createElement('div')).attr('id', 'movie' + i).appendTo($('.movies'));
			 	$(document.createElement('h1')).text(data.movies[i].title).addClass('title').appendTo($('#movie' + i));
				$(document.createElement('p')).text(data.movies[i].plot).addClass('plot').appendTo($('#movie' + i));
			}
		};

	 $('.movies-index').ready(function(){
		loadajax(showMovies)
	})
}


//SERIES.JS///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadSeries() {

	function loadajax(callback){
	  $.ajax({ 
	    url:'http://api.wuaki.dev:3000/v1/series',
	    dataType:"json",
	    type:"GET",
	    success: function(data) {
	    	callback(data)

	    }
	  });
	}

	function showSeries(data) {
			console.log(data.series[0])
			for(var i = 0; i <= data.series.length -1; i++) {
				$(document.createElement('div')).attr('id', 'serie' + i).appendTo($('.series'));
			 	$(document.createElement('h1')).text(data.series[i].title).addClass('title').appendTo($('#serie' + i));
			}
		}

		function showSeasons() {
			$('body').click(' series .title', function(event){
				console.log(event.target)
				// $(document.createElement('div').attr('id'))
				// $(event.target).parent()
			})
		}

	 $('.series-index').ready(function(){
		loadajax(showSeries);
		showSeasons();

	})
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	


$( document ).ready(function() {
    sendParamsLogin();
    logOut();
    loadMovies();
    loadSeries();

});
