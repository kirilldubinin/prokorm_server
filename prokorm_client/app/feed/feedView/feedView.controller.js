(function() {
    'use strict';
    FeedViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'feedFactory', '_']
    angular.module('feed').controller('FeedViewController', FeedViewController);

    function FeedViewController($mdDialog, $stateParams, $state, feedFactory, _) {
        var vm = this;
        vm._ = _;
        var feedId = $stateParams.feedId;
        if (!feedId) {
            return;
        }
        vm.isDrySwitch = true;
        vm.print = function() {
            //onload="window.print()"
            var printContents = 
                document.getElementById('dashboard').innerHTML;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write(
                '<html>'+
                    '<head>'+
                        '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                        '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                    '</head>'+
                    '<body onload="window.print()" class="feed print">' + printContents + '</body>'+
                '</html>');
            popupWin.document.close();
        };
        vm.edit = function() {
            $state.go('tenant.feed.edit', {
                'feedId': feedId
            });
        };
        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm().title('removeFeedConfirmDialogTitle').textContent('removeFeedConfirmDialogContent').targetEvent(ev).ok('yes').cancel('no');
            $mdDialog.show(confirm).then(function() {
                feedFactory.deleteFeed($stateParams.feedId).then(function(res) {
                    $state.go('tenant.feed');
                });
            }, function() {});
        };
        feedFactory.getFeedView(feedId).then(function(feedView) {
            vm.feed = feedView.general;
            vm.feedItemSections = feedView.feedItemSections;
            vm.actions = feedView.actions;
        });
    }
})();