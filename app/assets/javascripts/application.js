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


function handleSuccessLog(data) {
	var token = data.auth_token;
	window.localStorage.setItem('token', token);
	window.location = '/all_medias'
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
		handleSuccessLog(respSendCredentials);
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

function loadAjax(url){
	  return $.ajax({ 
	    url: url,
	    dataType:"json",
	    type:"GET",
		error: handleError
	});
	}


//ALL_MEDIA.JS ///////////////////////////////////////////////////////////////////////////////////////////////////////////


function loadAllMedia() {

	function showMedias(data) {

		console.log(data.all_medias)

		data.all_medias.forEach(function(media){
			if (media.hasOwnProperty('seasons')) {
				buildSerieList(media);
			} else {
				buildMovieList(media);
			}
		})
		
		
	}

	if ($('body').hasClass('all_medias-index') == true){

	 $(document).ready(function(){


		 	$('.page-header h1').text('All Media');

			var showAllMedia = loadAjax('http://api.wuaki.dev:3000/v1/all_medias');

			$.when(showAllMedia).done(function(response) {
				//callback -> showMovies, showSeries...
				showMedias(response);
			});

		})
	}

}

//MOVIES.JS //////////////////////////////////////////////////////////////////////////////////////////////////////////////


function buildMovieList(movie) {
	$(document.createElement('div')).attr('id', 'movie-' + movie.id).appendTo($('.medias'));
	$(document.createElement('h1')).text(movie.title).addClass('title').appendTo($('#movie-' + movie.id));
	$(document.createElement('p')).text(movie.plot).addClass('plot').appendTo($('#movie-' + movie.id));
}

function showMovies (data) {
			data.movies.forEach(function(movie) {
				buildMovieList(movie);
			})
		};


function loadMovies() {

	if ($('body').hasClass('movies-index') == true){

		 $(document).ready(function(){

		 	$('.page-header h1').text('Most Recent Movies');

			var showAllMovies = loadAjax('http://api.wuaki.dev:3000/v1/movies');

			$.when(showAllMovies).done(function(response) {
			showMovies(response);
			});
		})
	}
}


//SERIES.JS///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var cache = {};

function buildEpisodeList(episode, self) {
	$(document.createElement('div')).attr('id', 'episode-' + episode.id).appendTo($(self.parent()));
	$(document.createElement('h3')).text(episode.title).addClass('title').appendTo($('#episode-' + episode.id));
	$(document.createElement('p')).text(episode.plot).addClass('plot').appendTo($('#episode-' + episode.id));
}

function showSeasons(serie_id, self, title) {
	cache['serie_' + serie_id].serie.seasons.forEach(function(season){
		buildSeasonList(season, self, title)
				})

}


function buildSeasonList(season, self, title, serie_id) {
	$(document.createElement('div')).attr('id', title + '-' + season.season_number).addClass('col-md-offset-2').appendTo($(self.parent()));
	$(document.createElement('h2')).text(season.season_number).addClass('season-' + season.season_number).appendTo($('#' + title + '-' + season.season_number));

	$('body').click('h2.season-' + season.season_number, function(event){
		console.log(season.episodes)
		season.episodes.forEach(function(episode) {
			buildEpisodeList(episode, self);

		})
		
	})

}






function showSeries(data) {		
			var id;
			data.series.forEach(function(serie) {

				buildSerieList(serie)		
			})
		}


function buildSerieList (serie) {

		id = serie.id;
		title = serie.title
		$(document.createElement('div')).attr('id', 'serie-' + id).appendTo($('.medias'));
		$(document.createElement('h1')).text(serie.title).addClass('title').appendTo($('#serie-' + id));

		$('body').click('h1.title', function(event){

			var self = $(event.target);
			var showSeasonsResponse = loadAjax('http://api.wuaki.dev:3000/v1/series/' + serie.id);
			
			$.when(showSeasonsResponse).done(function(response) {
				cache['serie_'+ id] = showSeasonsResponse.responseJSON;
				showSeasons(id, self, title);				
			});
			
		})

}









function loadSeries() {
			
		// 	$('body').click(' series .title', function(event){
		// 		//$(document.createElement('div').attr('id'))
		// 		var mov_div_id = $(event.target).parent().attr('id').split('-')[1];

		// 		loadAjax('http://api.wuaki.dev:3000/v1/series/' + mov_div_id, showSeason);
		// 	})
		// }

	if ($('body').hasClass('series-index') == true){

		 $(document).ready(function(){
		 	var showAllSeries = loadAjax('http://api.wuaki.dev:3000/v1/series');

		 	$.when(showAllSeries).done(function(response) {
			showSeries(response);
			});

		})
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	


$( document ).ready(function() {
    sendParamsLogin();
    logOut();
    loadMovies();
    loadSeries();
    loadAllMedia()

});
