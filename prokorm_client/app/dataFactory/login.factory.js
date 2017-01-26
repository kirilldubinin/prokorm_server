angular.module('prokorm').factory('loginFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var loginFactory = {};

    loginFactory.logout = function() {
        return $http.post(urlBase + 'logout/');
    };

    loginFactory.login = function(user) {
        return $http.post(urlBase + 'signin/', user);
    };

    loginFactory.registration = function(user) {
        return $http.post(urlBase + 'registration/', user);
    };

    // sessionData
    loginFactory.getSessionData = function() {
        return $http.get(urlBase + 'sessionData/')
    };

    // sessionData
    loginFactory.getProfileView = function() {
        return $http.get(urlBase + 'profile/view')
    };    

    return loginFactory;
}]);