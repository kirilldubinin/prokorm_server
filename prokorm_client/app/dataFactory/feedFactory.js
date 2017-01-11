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

    function isAPIrequest(url) {
        return /^\/?api\//.test(url)
    }
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

                if (isAPIrequest(response.config.url)) {
                    return response.data;
                }
                return response;
            },
            // optional method
            'responseError': function(rejection) {

                alert(rejection.data.message || rejection.data.name);
                if (rejection.status === 401) {
                    $injector.get('$state').transitionTo('farm.login');
                }

                if (isAPIrequest(rejection.config.url)) {
                    return $q.reject(rejection.data)
                }
                return $q.reject(rejection);
            }
        };
    });
    // This will automatically convert all strings in server JSON responses to date
    //var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
    var regexIso8601 = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;
    $httpProvider.defaults.transformResponse.push(function(responseData) {
        convertDateStringsToDates(responseData);
        return responseData;
    });
    function convertDateStringsToDates(input) {
        // Ignore things that aren't objects.
        if (typeof input !== "object") return input;
        for (var key in input) {
            if (!input.hasOwnProperty(key)) continue;
            var value = input[key];
            var match;
            // Check for string properties which look like dates.
            // TODO: Improve this regex to better match ISO 8601 date strings.
            if (typeof value === "string" && (match = value.match(regexIso8601))) {
                // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
                var milliseconds = Date.parse(match[0]);
                if (!isNaN(milliseconds)) {
                    input[key] = new Date(milliseconds);
                }
            } else if (typeof value === "object") {
                // Recurse into object
                convertDateStringsToDates(value);
            }
        }
    }
}]);
angular.module('prokorm').factory('feedHttp', ['$http', '$location', function($http, $location) {

    var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var feedHttp = {};
    // login
    feedHttp.logout = function() {
        return $http.post(urlBase + 'logout/');
    };

    feedHttp.login = function(user) {
        return $http.post(urlBase + 'signin/', user);
    };

    feedHttp.registration = function(user) {
        return $http.post(urlBase + 'registration/', user);
    };

    // sessionData
    feedHttp.getSessionData = function() {
        return $http.get(urlBase + 'sessionData/')
    };
    // feed
    feedHttp.getFeeds = function() {
        return $http.get(urlBaseFeed);
    };
    feedHttp.saveFeed = function(feed) {
        var methode = feed._id ? 'put' : 'post';
        var url = feed._id ? (urlBaseFeed + feed._id) : urlBaseFeed
        return $http[methode](url, feed);
    };
    feedHttp.getFeedView = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/view');
    };
    feedHttp.getFeedEdit = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/edit');
    };
    feedHttp.getEmptyFeed = function() {
        return $http.post(urlBaseFeed + 'new');
    };
    feedHttp.deleteFeed = function(feedId) {
        return $http.delete(urlBaseFeed + feedId);
    };
    feedHttp.diffFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diff', {
            feedIds: feedIds
        });
    };

    // catalog
    feedHttp.getCatalog = function () {
        return $http.get(urlBase + 'catalog');
    };

    feedHttp.getCatalogContentByKey = function (key) {
        return $http.get(urlBase + 'catalog/' + key);
    };    

    return feedHttp;
}]);