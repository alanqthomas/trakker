(function(){

	angular.module('trakker').controller('landingController',
	['$scope', '$http', 'API', '$state', '$localStorage',
	function($scope, $http, API, $state, $localStorage){

		function init(){
		}

		function storeTokenAndForward(token) {
			console.log('store and forward', token)
			$localStorage.token = token
			$localStorage.email = $scope.user.email
			$state.go('home')
		}

		$scope.signin = function() {
			$http.post(API.VERSION_1 + "signin/", $scope.user)
				.then(function(response) {
					console.log('signed in', response)
					storeTokenAndForward(response.data.token)
				}, function(response) {
					console.log('error', response)
					$scope.errorMessage = response.data
				})
		}

		$scope.signup = function() {
			$http.post(API.VERSION_1 + 'signup/', $scope.user)
				.then(function(response) {
					console.log('success', response)
					storeTokenAndForward(response.data.token)
				}, function(response) {
					console.log('error', response)
					$scope.errorMessage = response.data.error
				})
		}

		init()

	}])

})();
