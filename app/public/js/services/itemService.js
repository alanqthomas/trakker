(function(){

	angular.module('trakker').factory('Item',
	['$resource', 'API',	function($resource, API){
		return $resource(API.VERSION_1 + 'item/:id', null,
		{
			'update': { method: 'PUT' }
		});
	}]);

})();
