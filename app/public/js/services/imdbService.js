(function(){

	angular.module('trakker').factory('Imdb',
		['$http', 'API', function($http, API){
			return {
				getById: function(id) {
					var promise =	$http.get(API.VERSION_1 + 'imdb/id/' + id)
						.then(function(res){
							return res.data
						},function(res){
							return res
						})
					return promise
				},
				getByTitle: function(title) {
					var promise = $http(API.VERSION_1 + 'imdb/title/' + title)
					.then(function(res){
						return res.data
					},function(res){
						return res
					})
					return promise
				}
			}
		}])

})();
