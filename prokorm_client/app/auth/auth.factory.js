angular.module('auth').factory('authFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var authFactory = {};

    authFactory.logout = function() {
        return $http.post(urlBase + 'logout/');
    };

    authFactory.login = function(user) {
        return $http.post(urlBase + 'signin/', user);
    };

    authFactory.registration = function(user) {
        return $http.post(urlBase + 'registration/', user);
    };

    // sessionData
    authFactory.getSessionData = function() {
        return $http.get(urlBase + 'sessionData/');
    };

    // profile
    authFactory.getProfileView = function() {
        return $http.get(urlBase + 'profile/view/');
    };    
    authFactory.getProfileEdit = function() {
        return $http.get(urlBase + 'profile/edit');
    };
    authFactory.updateProfile = function(profile) {
        return $http.put(urlBase + 'profile/', profile);
    };
    authFactory.addUser = function(user) {
        return $http.post(urlBase + 'users/', user);
    };
    authFactory.setPassword = function (pass) {
        return $http.post(urlBase + 'profile/password/', pass);    
    };
    authFactory.forgetPassword = function (pass) {
        return $http.post(urlBase + 'forget/', pass);    
    };

    return authFactory;
}]);