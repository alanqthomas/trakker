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

})()
