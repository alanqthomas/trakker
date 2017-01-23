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
			$http.post('auth/signin/', $scope.user)
				.then(function(response) {
					console.log('signed in', response)
					storeTokenAndForward(response.data.token)
				}, function(response) {
					console.log('error', response)
					$scope.errorMessage = response.data
				})
		}

		$scope.signup = function() {
			$http.post('auth/signup/', $scope.user)
				.then(function(response) {
					console.log('success', response)
					storeTokenAndForward(response.data.token)
				}, function(response) {
					console.log('error', response)
					$scope.errorMessage = response.data.error
				})
		}

		$scope.googleSignin = function() {
			$http.get('auth/google/')
				.then(function(response) {
					console.log('google signin success', response)
					$state.go('home')
				}, function(response) {
					console.log('google signin error', response)
					$scope.errorMessage = response.data
				})
		}

		init()

	}])

})();
