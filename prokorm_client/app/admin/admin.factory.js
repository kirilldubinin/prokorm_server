angular.module('admin').factory('adminFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var adminFactory = {};
    adminFactory.getTenants = function () {
        return $http.get(urlBase + 'tenants');
    };
    adminFactory.getTenant = function (_id) {
        return $http.get(urlBase + 'tenants/' + _id);
    };
    return adminFactory;
}]);