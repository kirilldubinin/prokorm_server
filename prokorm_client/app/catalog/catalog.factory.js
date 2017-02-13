angular.module('catalog').factory('catalogFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var catalogFactory = {};
    catalogFactory.getCatalog = function () {
        return $http.get(urlBase + 'catalog');
    };
    catalogFactory.getCatalogContentByKey = function (key) {
        return $http.get(urlBase + 'catalog/' + key);
    };  
    catalogFactory.saveCatalogContentByKey = function (catalog) {
        return $http.put(urlBase + 'catalog/' + catalog.key, catalog);
    };

    return catalogFactory;
}]);