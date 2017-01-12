// Register factory
angular.module('prokorm').factory('diff', DiffFactory);

function DiffFactory(_) {
    
    var _onAdd = angular.noop;
    var _onClear = angular.noop;
    var _onChange = angular.noop;

    var feedsForDiff = [];
    return {
        inDiff: function (feed) {
            return _.some(feedsForDiff, function (f) {
                return f === feed;
            });
        },
        toggleFeed: function (feed) {
            var existing = _.remove(feedsForDiff, function (f) {
                return f._id === feed._id;
            });

            if (!existing.length) {
                feedsForDiff.push(feed);
            }
            _onChange(feedsForDiff);
        },
    	getFeeds: function () {
    		return feedsForDiff;
    	},
    	addFeed: function (feed) {
    		feedsForDiff.push(feed);
    		_onAdd(feed);
    	},
    	clear: function () {
    		feedsForDiff = [];
    		_onChange(feedsForDiff);
    	},
    	_onClear: function (fn) {
    		if (angular.isFunction(fn)) {
    			_onClear = fn;
    		}
    	},
    	onAdd: function (fn) {
    		if (angular.isFunction(fn)) {
    			_onAdd = fn;
    		}
    	},
        onChange: function (fn) {
            if (angular.isFunction(fn)) {
                _onChange = fn;
            }    
        }
    }
}
