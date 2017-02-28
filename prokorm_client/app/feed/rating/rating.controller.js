(function() {
    'use strict';
    angular.module('feed').controller('RatingController', RatingController);

    function RatingController($scope, feedFactory, $state, $stateParams, _) {

    	var vm = this;
        vm.props = $state.current.data.feedType === 'haylage' ?
            ['Сухое вещество', 'Баланс расщепляемого протеина, OEB', 
            'Переваримость органического вещества, VCOS', 'NH3-фракция', 
            'Сахар', 'Нейтрально-детергентная клетчатка, NDF',
            'Сырой протеин'] :
            ['Сухое вещество', 'Чистая энергия на лактацию, NEL', 
            'Переваримость органического вещества, VCOS',
            'NH3-фракция', 'Крахмал', 'Нейтрально-детергентная клетчатка, NDF'];
        
        vm.feedType = $state.params.feedType;
        //vm.feedTypes = [{key: 'haylage', name: 'Сенаж'}, {key: 'silage', name: 'Силос'}];

        var feeds = $stateParams.feeds;

        vm.goToHaylage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'haylage'
            });
        };
        vm.goToSilage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'silage'
            });
        };

    	function updateRating(feeds) {

    		if (!feeds.length) {
    			vm.feeds = [];
                vm.properties = [];
    			return;
    		}

    		feedFactory.ratingFeeds(feeds, vm.feedType).then(function (result) {
                vm.properties = result.properties;
                vm.feeds = result.feeds;
    		});
    	};	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.rating.haylage') {
                updateRating(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();