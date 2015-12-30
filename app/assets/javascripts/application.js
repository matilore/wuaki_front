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


function btnId (target) { return $(target).attr('id') };


function allMediaPage() {
		if ($('button#all_media').hasClass('active') == true) {
			loadAllMedia();
		};
}


var cache = {};

function menuButtons() {
	$('.jumbotron .menu').click('button', function(event){

		clickedBtn = $(event.target);
		var id = btnId (clickedBtn);

		if(!($(clickedBtn).hasClass('active'))) {

			$($(clickedBtn).parent()).find('.active').toggleClass('active');
			$(clickedBtn).addClass('active');

			$($('.medias').children('div')).remove();

			switch(id) {
				case 'movies': 
					loadMovies()
					break;
				case 'series':
					loadSeries()
					break;
				case 'all_media':
					loadAllMedia()
					break;
			}
		}

	})
}


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
	window.location = 'sessions/new'
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
	$('.logOut').click(function(event) {
		event.preventDefault();
		var auth_token_val = window.localStorage.getItem('token');

		$.ajax({
			url : 'http://api.wuaki.dev:3000/v1/sessions/' + auth_token_val,
			type : 'DELETE',
			// success: function() {
			// 	window.location = '/sessions/new';
			// }
		});
	});
};

function loadAjax(url){
	  return $.ajax({
			headers: {
		    "Authorization": window.localStorage.getItem('token')
		},
	    url: url,
	    dataType:"json",
	    type:"GET",
		error: handleError
	});
	}


//ALL_MEDIA.JS ///////////////////////////////////////////////////////////////////////////////////////////////////////////


function loadAllMedia() {


	function showMedias(data) {

		data.all_medias.forEach(function(media){
			if (media.hasOwnProperty('seasons')) {
				buildSerieList(media);
			} else {
				buildMovieList(media);
			}
		})
		
		
	}


		 	$('.page-header h1').text('All Media');

			var showAllMedia = loadAjax('http://api.wuaki.dev:3000/v1/all_medias');

			$.when(showAllMedia).done(function(data) {
				//callback -> showMovies, showSeries...
				showMedias(data);
			});

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

		$('medias').children().remove();


		 	$('.page-header h1').text('Most Recent Movies');

			var showAllMovies = loadAjax('http://api.wuaki.dev:3000/v1/movies');

			$.when(showAllMovies).done(function(response) {
			showMovies(response);
			});

}


//SERIES.JS///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadSeries() {

	$('.page-header h1').text('Most Recent Series');

	var showAllSeries = loadAjax('http://api.wuaki.dev:3000/v1/series');

	$.when(showAllSeries).done(function(response) {
		showSeries(response);
	});
}

function showSeries(data) {		
			data.series.forEach(function(serie) {

				buildSerieList(serie)		
			})
		}


function buildSerieList (serie) {

		var id = serie.id;
		var title = serie.title
		$(document.createElement('div')).attr('id', 'serie-' + id).appendTo($('.medias'));
		$(document.createElement('h1')).text(serie.title).addClass('title').appendTo($('#serie-' + id));
}

	////////////////////////////////////APPARE IL TITOLO DELLA SERIE///////////////////////////////

function clickOnTitle () {

	$('.medias').on('click', 'h1.title', function(event){



		var media_description = $(event.target).parent().attr('id').split('-');

		var media_type = media_description[0];

		var serie_id = media_description[1];



		if (media_type.indexOf('serie') > -1) {


				var self = $(event.target);

				if (!($(self).hasClass('active'))) {
					$(self).toggleClass('active');

				var showSeasonsResponse = loadAjax('http://api.wuaki.dev:3000/v1/series/' + serie_id);
					$.when(showSeasonsResponse).done(function(response) {
						cache['serie_'+ serie_id] = showSeasonsResponse.responseJSON;
						showSeasons(serie_id, self);				
					});
					
				} else {
					$(self).toggleClass('active');
					$($($(self).parent()).find('div.seasons' + serie_id)).remove();

				}

			}
	});
}

var season_counter = 0;

function showSeasons(serie_id, self) {

	$(document.createElement('div')).addClass('seasons' + serie_id).appendTo($(self.parent()));

	var title = cache['serie_' + serie_id].serie.title.split(/\W/g).join('');

	
	
	cache['serie_' + serie_id].serie.seasons.forEach(function(season){

	buildSeasonList(season, title, serie_id);
				})

	season_counter = 0;
}



function buildSeasonList(season, title, serie_id) {

	$(document.createElement('div')).attr('id', title + '-' + season.season_number).addClass('col-md-offset-2').appendTo($('.seasons'+ serie_id));
	$(document.createElement('h2')).text(season_counter += 1).addClass('season-' + season.season_number).appendTo($('#' + title + '-' + season.season_number));

}	


	//////////////////////////////////////////////// APPARE IL NUMERO DI STAGIONE //////////////////////////////////////////////


function clickOnSeasonNumber() {

	$('.medias').on('click', 'h2', function(event){

		var serie_id = $($($(event.target).parent()).parent()).parent().attr('id').split('-')[1];
		var season_id = $(event.target).attr('class').split('-')[1];
		var season_number = $(event.target).text();


		if (!($(event.target).hasClass('active'))) {

			$(event.target).addClass('active');
			$(document.createElement('div')).addClass('episodes' + season_id).appendTo($($(event.target).parent()));
			cache['serie_' + serie_id].serie.seasons[season_number - 1].episodes.forEach(function(episode) {
				buildEpisodeList(episode, season_id);
			});
			
		} else {

			$(event.target).removeClass('active');
			$($(event.target).siblings('div')).remove();
			
		}

	})

}

function buildEpisodeList(episode, season_id) {
	$(document.createElement('div')).attr('id', 'episode-' + episode.episode_number).addClass('col-md-offset-1').appendTo($('.episodes' + season_id));
	$(document.createElement('h3')).text(episode.title).addClass('title').appendTo($('#episode-' + episode.episode_number));
	$(document.createElement('p')).text(episode.plot).addClass('plot').appendTo($('#episode-' + episode.episode_number));
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	


$( document ).ready(function() {
	allMediaPage()
    sendParamsLogin();
    logOut();
    menuButtons();
    clickOnTitle();
    clickOnSeasonNumber();
});
