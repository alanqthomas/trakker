(function(){

	angular.module('trakker').controller('homeController',
	['$scope', '$http', 'Item', '$location', '$log', 'ITEM_TYPES', 'API',
	'STATUS_COLORS', 'ITEM_STATUSES', 'Imdb', '$mdDialog', '$mdToast', '$state',
	'$localStorage',
	function($scope, $http, Item, $location, $log, ITEM_TYPES, API,
					STATUS_COLORS, ITEM_STATUSES, Imdb, $mdDialog, $mdToast, $state,
					$localStorage){

		function init(){

			loadItems()
			$scope.addItemForm = {}
			// Constants for drop downs
			$scope.ITEM_TYPES = ITEM_TYPES
			$scope.ITEM_STATUSES = ITEM_STATUSES
			$scope.statuses = []

			$scope.cardOrder = "name"
			$scope.cardOrderReverse = false

			$scope.cardToggle = ''

			$scope.email = $localStorage.email ? $localStorage.email : ''

			$scope.typeFilters = []
			$scope.ITEM_TYPES.forEach(function(element){
				$scope.typeFilters.push(element.value)
			})

			$scope.statusFilters = []

			$scope.search = {}

			$scope.newItem = {}
			$scope.updatedItem = {}
		}

		var typeToIndex = {
			'movie': 0,
			'tv_series': 1,
			'video_game': 2
		}

		$scope.showToast = function(message) {
			$mdToast.show(
				$mdToast.simple()
					.textContent(message)
					.position('bottom right')
					.hideDelay(4000)
			);
		}

		$scope.signout = function() {
			$log.debug('signed out')
			$localStorage.token = null
			$localStorage.email = null
			$state.go('landing')
			$scope.showToast('Farewell, friend...')
		}

		$scope.changeCardOrder = function(field){
			if($scope.cardOrder === field){
				$scope.cardOrderReverse = !$scope.cardOrderReverse
			} else {
				$scope.cardOrderReverse = false
				$scope.cardOrder = field
			}
		}

		function loadItems(){
			$scope.items = Item.query(function(res){
				$log.info("Loaded items", res)
				$scope.items.forEach(function(e, i, a){
					loadImdb(e)
				})
				console.log('$scope.items', $scope.items)
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
			$scope.newItem.updatedDate = new Date()
			Item.save( $scope.newItem,
			function(res){
				$log.info("Added item", res)
				$scope.newItem = {}
				$scope.addItemForm.$setPristine()
				$scope.addItemForm.$setUntouched()
				$scope.showToast('Item added!')
				loadItems()
			}, function(err){
				$log.error("Error adding item", err)
				$scope.showToast('Oh no! There was a problem trying to add the item.')
			})
		}

		$scope.deleteItem = function(id){
			$log.debug(id)
			Item.remove({id: id}, function(res){
				$log.debug(res)
				$scope.showToast('Bye item :(')
				loadItems()
			}, function(res){
				$log.error(res)
				$scope.showToast('There was a problem trying to delete this item.')
			})
		}

		$scope.updateItem = function(item){
			$log.debug(item)
			item.updatedDate = new Date()
			Item.update({id: item._id}, item, function(res){
				$log.debug(res)
				$scope.showToast('Item updated!')
				loadImdb(item)
			}, function(res){
				$scope.showToast('There was a problem trying to update this item.')
				$log.error(res)
			})
		}

		$scope.updateItemSubmit = function(){
			$log.debug("updated item", $scope.updatedItem)
			$scope.updateItem($scope.updatedItem)
			$scope.showEditPanel = false
		}

		$scope.editItem = function(item){
			$scope.updatedItem = item
			$scope.updateTypeChanged()
			console.log('updated item', $scope.updatedItem)
			if(item.imdb){
				$scope.updatedItem.imdb = item.imdb.imdbid ? item.imdb.imdbid : item.imdb
			}
			$scope.showEditPanel = true;
		}

		$scope.typeChanged = function(){
			var index = typeToIndex[$scope.newItem.type]
			$scope.statuses = ITEM_TYPES[index].statuses
		}

		$scope.updateTypeChanged = function(){
			if(!$scope.updatedItem.type)
				return
			var index = typeToIndex[$scope.updatedItem.type]
			$scope.updateStatuses = ITEM_TYPES[index].statuses
		}

		$scope.incrementEpisodeCount = function(item){
			item.progress.episode = String(Number(item.progress.episode) + 1)
			$scope.updateItem(item)
		}

		$scope.changeStatus = function(item, status){
			$log.debug(item, status)
			item.status = status
			$scope.updateItem(item)
		}

		$scope.checkShowImage = function(item){
			$log.debug("checkShowImage", item.title, item.imdb !== null || item.imageURL !== null)
			if(item.imdb !== null || item.imageURL !== null){
				return true
			} else {
				return false
			}
		}

		$scope.searchFilter = function(item) {
			if(!$scope.search.text){
				return true
			}

			if(item.name.toLowerCase().search($scope.search.text.toLowerCase()) >= 0){
				return true;
			}

			return false;
		}

		$scope.cardTypeFilter = function(item){
			if(!item.type)
				return true

			var type = $scope.typeFilters.indexOf(item.type) > -1
			var status = true

			if($scope.statusFilters.length > 0){
				status = $scope.statusFilters.indexOf(item.status) > -1
			}

			return type && status
		}

		$scope.checkTypeFilter = function(type){
			return $scope.typeFilters.indexOf(type.value) > -1
		}

		$scope.updateTypeFilters = function(type){
			if($scope.checkTypeFilter(type)){
				var i = $scope.typeFilters.indexOf(type.value)
				$scope.typeFilters.splice(i, 1)
			} else {
				$scope.typeFilters.push(type.value)
			}

			if($scope.typeFilters.length == 1){
				ITEM_STATUSES[$scope.typeFilters[0]].forEach(function(element){
					$scope.statusFilters.push(element.value)
				})
			} else {
				$scope.statusFilters = []
			}
		}

		$scope.clearTypeFilters = function(){
			$scope.typeFilters = []
		}

		$scope.addAllTypeFilters = function(){
			$scope.typeFilters = []
			$scope.ITEM_TYPES.forEach(function(element){
				$scope.typeFilters.push(element.value)
			})
		}

		$scope.updateStatusFilters = function(status){
			if($scope.checkStatusFilter(status)){
				var i = $scope.statusFilters.indexOf(status.value)
				$scope.statusFilters.splice(i, 1)
			} else {
				$scope.statusFilters.push(status.value)
			}
		}

		$scope.checkShowStatusControls = function(item){
			return true
		}

		$scope.toggleStatusControls = function(item){
			if($scope.cardToggle === item._id)
				$scope.cardToggle = ''
			else
				$scope.cardToggle = item._id
		}

		$scope.checkStatusFilter = function(status){
			return $scope.statusFilters.indexOf(status.value) > -1
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

		init()

	}])

})();
