(function(){

	var app = angular.module('trakker')

	app.constant('ITEM_TYPES', [
		{"name": "Movie",
		"value": "movie",
		"statuses": [
			{"name": "Not Watched", "value": "not_watched"},
			{"name": "Watched", "value": "watched"}
		]},
		{"name": "TV Series",
		"value": "tv_series",
		"statuses": [
			{"name": "Not Started", "value": "not_started"},
			{"name": "Behind", "value": "behind"},
			{"name": "Up To Date", "value": "up_to_date"},
			{"name": "Finished", "value": "finished"}
		]},
		{"name": "Video Game",
		"value": "video_game",
		"statuses": [
			{"name": "Not Played", "value": "not_played"},
			{"name": "Playing", "value": "playing"},
			{"name": "Finished", "value": "finished"}
		]}
	])

	app.constant('ITEM_STATUSES', {
		"movie": [
			{"name": "Not Watched", "value": "not_watched"},
			{"name": "Watched", "value": "watched"}
		],
		"tv_series": [
			{"name": "Not Started", "value": "not_started"},
			{"name": "Behind", "value": "behind"},
			{"name": "Up To Date", "value": "up_to_date"},
			{"name": "Finished", "value": "finished"}
		],
		"video_game": [
			{"name": "Not Played", "value": "not_played"},
			{"name": "Playing", "value": "playing"},
			{"name": "Finished", "value": "finished"}
		]
	})

	app.constant('API', {
		"VERSION_1": "api/v1/"
	})

})();
