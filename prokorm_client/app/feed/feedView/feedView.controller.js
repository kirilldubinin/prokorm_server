(function() {
    'use strict';
    angular.module('prokorm').controller('FeedViewController', FeedViewController);

    function FeedViewController($mdDialog, $stateParams, $state, feedHttp, diff, _) {
        
        var vm = this;

        var feedId = $stateParams.feedId;
        if (!feedId) {
            return;
        }
        vm.isDrySwitch = true;
        vm.diff = function() {
            $state.go('farm.instance.feed.diff', {
              'feeds': [feedId].join(':')
            });
            //diff.toggleFeed(vm.feed);
        }
        vm.edit = function() {
            $state.go('farm.instance.feed.edit', {
                'feedId': feedId
            });
        };
        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm()
            .title('removeFeedConfirmDialogTitle').textContent('removeFeedConfirmDialogContent')
            .targetEvent(ev).ok('yes').cancel('no');
            $mdDialog.show(confirm).then(function() {
                feedHttp.deleteFeed($stateParams.feedId).then(function(res) {
                  $state.go('farm.instance.feed');
                });
            }, function() {});
        }; 

        feedHttp.getFeedView(feedId).then(function(feedView) {
          vm.feed = feedView.general;
          vm.feedItemSections = feedView.feedItemSections;
        });
    }
})();