(function(){

	angular.module('trakker').controller('homeController',
	['$scope', '$http', 'Item', '$location', '$log', 'ITEM_TYPES', 'STATUS_COLORS', 'ITEM_STATUSES', 'Imdb', '$mdDialog',
	function($scope, $http, Item, $location, $log, ITEM_TYPES, STATUS_COLORS, ITEM_STATUSES, Imdb, $mdDialog){

		function init(){
			loadItems()
			$scope.addItemForm = {}
			// Constants for drop downs
			$scope.ITEM_TYPES = ITEM_TYPES
			$scope.ITEM_STATUSES = ITEM_STATUSES
			$scope.statuses = []
		}

		function loadItems(){
			$scope.items = Item.query(function(res){
				$log.info("Loaded items", res)
				$scope.items.forEach(function(e, i, a){
					loadImdb(e)
				})
			}, function(err) {
				$log.error("Error loading items", err)
			})
		}

		function loadImdb(item){
			if('imdb' in item){
				Imdb.getById(item.imdb).then(function(data){
					$log.debug('IMDB api data: ', data)
					if(data)
						item.imdb = data
				})
			}
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
				loadImdb(item)
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

		$scope.incrementEpisodeCount = function(item){
			item.progress.episode = String(Number(item.progress.episode) + 1)
			$scope.updateItem(item)
		}

		$scope.changeStatus = function(item, status){
			console.log(item, status);
			item.status = status;
			$scope.updateItem(item);
		}

		$scope.setStatusColor = function(item){
			var color = STATUS_COLORS[item.status];

			switch(color){
				case "green":
					colorStyle = "#8BC34A"
					break
				case "red":
					colorStyle = "#F44336"
					break
				case "blue":
					colorStyle = "#2196F3"
					break
				case "dark-green":
					colorStyle = "#009688"
					break
				default:
					colorStyle = color
			}

			return { "background-color":  colorStyle}
		}

		$scope.openMenu = function($mdOpenMenu, ev){
			$mdOpenMenu(ev);
		}

		init()

	}])

})();
