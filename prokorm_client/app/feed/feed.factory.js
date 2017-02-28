angular.module('feed').factory('feedFactory', ['$http', '$location', function($http, $location) {

    var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var feedFactory = {};

    // feed
    feedFactory.getFeeds = function() {
        return $http.get(urlBaseFeed);
    };
    feedFactory.getFeedDashboard = function() {
        return $http.get(urlBaseFeed + 'dashboard');
    };
    feedFactory.saveFeed = function(feed) {
        var methode = feed._id ? 'put' : 'post';
        var url = feed._id ? (urlBaseFeed + feed._id) : urlBaseFeed;
        return $http[methode](url, feed);
    };
    feedFactory.getFeedView = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/view');
    };
    feedFactory.getFeedViewDemo = function() {
        return $http.get(urlBaseFeed + 'viewDemo');
    };
    feedFactory.getFeedEdit = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/edit');
    };
    feedFactory.getEmptyFeed = function() {
        return $http.post(urlBaseFeed + 'new');
    };
    feedFactory.getEmptyAnalysis = function() {
        return $http.post(urlBaseFeed + 'newAnalysis');
    };
    feedFactory.deleteFeed = function(feedId) {
        return $http.delete(urlBaseFeed + feedId);
    };
    feedFactory.diffFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diff', {feedIds: feedIds});
    };
    feedFactory.diffDemoFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diffDemo');
    };
    feedFactory.sumFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'sum', {feedIds: feedIds});
    };
    feedFactory.sumDemoFeeds = function() {
        return $http.post(urlBaseFeed + 'sumDemo');
    };
    feedFactory.averageFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'average', {feedIds: feedIds});
    };
    feedFactory.averageDemoFeeds = function() {
        return $http.post(urlBaseFeed + 'averageDemo');
    };
    feedFactory.chartsFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'charts', {feedIds: feedIds});
    };
    feedFactory.ratingFeeds = function (feedIds, feedType) {
        return $http.post(urlBaseFeed + 'rating', {feedIds: feedIds, feedType: feedType});
    };
    return feedFactory;
}]);