(function(){

	var app = angular.module('trakker')

	app.config(function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/")

		$stateProvider
			.state('home',{
				url: "/home",
				templateUrl: 'views/home.html',
				authenticate: true
			})
			.state('landing', {
				url: "/",
				templateUrl: 'views/landing.html',
				authenticate: false
			})
	})

	app.run(function ($rootScope, $state, $localStorage, $mdToast) {
		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
			if(toState.authenticate && !$localStorage.token) {
				$mdToast.show(
					$mdToast.simple()
						.textContent("Oops! You're not signed in.")
						.highlightClass('md-warn')
						.position('top right')
						.hideDelay(4000)
				);
				$state.go('landing')
				event.preventDefault()
			}
		})
	})

})();
