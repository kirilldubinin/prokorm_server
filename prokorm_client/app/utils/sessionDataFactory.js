function SessionDataFactory() {
	
	var _user = {};

    function setSessionUser(user) {
    	_user = user;
    }

    function getSessionUser() {
    	return _user;
    }

    return {
    	setSessionUser: setSessionUser,
    	getSessionUser: getSessionUser
    }
}
// Register factory
angular.module('prokorm').factory('sessionData', SessionDataFactory);