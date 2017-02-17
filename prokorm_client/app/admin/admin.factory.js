angular.module('admin').factory('adminFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var adminFactory = {};
    adminFactory.getTenants = function () {
        return $http.get(urlBase + 'tenants');
    };
    return adminFactory;
}]);