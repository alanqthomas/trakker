(function(){
	var app = angular.module('trakker',[
		'ui.router',
		'ngResource',
		'ngAnimate',
		'ngAria',
		'ngMessages',
		'ngMaterial'
	])
})();

(function(){

	var app = angular.module('trakker')

	app.config(function($stateProvider, $urlRouterProvider){
			$urlRouterProvider.otherwise("/home")

			$stateProvider
				.state('home',{
					url: "/home",
					templateUrl: 'views/home.html'
				})
	})

})();

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

(function(){

	angular.module('trakker').controller('homeController',
	['$scope', '$http', 'Item', '$location', '$log', 'ITEM_TYPES', 'Imdb', '$mdDialog',
	function($scope, $http, Item, $location, $log, ITEM_TYPES, Imdb, $mdDialog){

		function init(){
			loadItems()
			$scope.addItemForm = {}
			// Constants for drop downs
			$scope.ITEM_TYPES = ITEM_TYPES
			$scope.statuses = []
		}

		function loadItems(){
			$scope.items = Item.query(function(res){
				$log.info("Loaded items", res)
				$scope.items.forEach(function(e, i, a){
					if('imdb' in e){
						Imdb.getById(e.imdb).then(function(data){
							$log.debug('IMDB api data: ', data)
							if(data)
								e.imdb = data
						})
					}
				})
			}, function(err) {
				$log.error("Error loading items", err)
			})
		}

		$scope.addItem = function(){
			Item.save( $scope.newItem,
			function(res){
				$log.info("Added item", res)
				$scope.newItem = {}
				$scope.addItemForm.$setPristine()
				loadItems()
			}, function(err){
				$log.error("Error adding item", err)
			})
		}

		$scope.deleteItem = function(id){
			$log.debug(id)
			Item.delete({id: id}, function(res){
				$log.debug(res)
				loadItems()
			}, function(res){
				$log.error(res)
			})
		}

		$scope.updateItem = function(item){
			$log.debug(item)
			Item.update({id: item._id}, item, function(res){
				$log.debug(res)
				loadItems()
			}, function(res){
				$log.error(res)
			})
		}

		$scope.typeChanged = function(index){
			$scope.statuses = ITEM_TYPES[index].statuses
		}

		$scope.showIMDBPrompt = function(ev, item){
			var dialog = $mdDialog.prompt()
				.clickOutsideToClose(true)
				.title('IMDB ID')
				.textContent('Enter an IMDB ID e.g. tt0111161')
				.ariaLabel('IMDB ID')
				.initialValue(item.imdb.imdbid ? item.imdb.imdbid : item.imdb)
				.targetEvent(ev)
				.ok('Update')
				.cancel('Cancel')

			$mdDialog.show(dialog).then(function(result){
				$log.debug('Prompt result: ', result)
				item.imdb = result
				$scope.updateItem(item)
			}, function(){
				$log.debug('Cancelled')
			})
		}

		init()

	}])

})();

(function(){

	angular.module('trakker').directive('itemCard',
	function(){
		return{
			restrict: 'E',
			templateUrl: 'views/item-card.html'
		}
	})

})();

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
					var promise = $http(API.VERSION_1 + '/imdb/title/' + title)
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

(function(){

	angular.module('trakker').factory('Item',
	['$resource', 'API',	function($resource, API){
		return $resource(API.VERSION_1 + 'item/:id', null,
		{
			'update': { method: 'PUT' }
		})
	}])

})();
