angular.module('prokorm').config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $httpProvider.interceptors.push(function($q, $injector) {
        return {
            // optional method
            'request': function(config) {
                // do something on success
                return config;
            },
            // optional method
            'requestError': function(rejection) {
                return $q.reject(rejection);
            },
            // optional method
            'response': function(response) {
                // do something on success
                return response;
            },
            // optional method
            'responseError': function(rejection) {
                if (rejection.status === 401) {
                    $injector.get('$state').transitionTo('farm.login');
                } 
                return $q.reject(rejection);
            }
        };
    });
}]);
angular.module('prokorm').factory('feedHttp', ['$http', function($http) {
    var urlBase = 'http://localhost:8080/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var feedHttp = {};

    // login
    feedHttp.logout = function() {
        return $http.post(urlBase + 'logout/').then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };

    // sessionData
    feedHttp.getSessionData = function() {
        return $http.get(urlBase + 'sessionData/').then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };

    // feed
    feedHttp.getFeeds = function() {
        return $http.get(urlBaseFeed).then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };
    feedHttp.saveFeed = function(feed) {
        var methode = feed._id ? 'put' : 'post';
        var url = feed._id ? (urlBaseFeed + feed._id) : urlBaseFeed
        return $http[methode](url, feed).then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };
    feedHttp.getFeedView = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/view').then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };
    feedHttp.getFeedEdit = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/edit').then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    };
    feedHttp.getEmptyFeed = function() {
        return $http.post(urlBaseFeed + 'new').then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    }
    feedHttp.deleteFeed = function(feedId) {
        return $http.delete(urlBaseFeed + feedId);
    };
    feedHttp.diffFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diff', {
            feedIds: feedIds
        }).then(function(response) {
            if (response.data) {
                return response.data;
            }
        });
    }
    return feedHttp;
}]);