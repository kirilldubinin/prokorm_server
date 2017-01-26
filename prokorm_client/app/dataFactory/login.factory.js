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

    // profile
    loginFactory.getProfileView = function() {
        return $http.get(urlBase + 'profile/view')
    };    
    loginFactory.getProfileEdit = function() {
        return $http.get(urlBase + 'profile/edit')
    };
    loginFactory.updateProfile = function(profile) {
        return $http.put(urlBase + 'profile', profile);
    };
    loginFactory.addUser = function(user) {
        return $http.post(urlBase + 'users', user);
    };

    return loginFactory;
}]);