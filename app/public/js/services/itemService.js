(function(){

	angular.module('trakker').factory('Item',
	['$resource', 'API', '$localStorage',	function($resource, API, $localStorage){
		return $resource(API.VERSION_1 + 'item/:id', {headers: {'Authorization': $localStorage.token}},
		{
			'get': { method: 'GET', headers: {'Authorization': $localStorage.token}},
			'save': { method: 'POST', headers: {'Authorization': $localStorage.token}},
			'remove': { method: 'DELETE', headers: {'Authorization': $localStorage.token}},
			'update': { method: 'PUT', headers: {'Authorization': $localStorage.token}},
			'query': { method: 'GET', isArray: true, headers: {'Authorization': $localStorage.token}},
		})
	}])

})();
