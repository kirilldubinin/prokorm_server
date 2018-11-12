(function() {
    'use strict';
    angular.module('feed').controller('RatingInstanceController', RatingInstanceController);

    function RatingInstanceController($scope, $state, feedFactory, $stateParams, _) {

        var allProps = {
            haylage: ['Сухое вещество', 'Баланс расщепляемого протеина, OEB', 
                'Переваримость органического вещества, VCOS', 'NH3-фракция', 
                'Сахар', 'Нейтрально-детергентная клетчатка, NDF',
                'Сырой протеин'],
            greenmass: ['Сырая зола', 'Баланс расщепляемого протеина, OEB',
                'Переваримость органического вещества, VCOS', 'Сахар',
                'Нейтрально-детергентная клетчатка, NDF', 'Сырой протеин'],

            silage: ['Сухое вещество', 'Чистая энергия на лактацию, NEL', 
                'Переваримость органического вещества, VCOS',
                'NH3-фракция', 'Крахмал', 'Нейтрально-детергентная клетчатка, NDF']
        };

        var allLabels = {
            haylage: 'Травяной сенаж',
            greenmass: 'Зеленая масса',
            silage: 'Кукурузный силос'
        };

        var vm = this;
        vm.feedType = $state.params.feedType;
        vm.props = allProps[vm.feedType];
        vm.feedTypeLabel = allLabels[vm.feedType];
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
        
        $state.params.feeds && updateRating(_.filter($state.params.feeds.split(':'), Boolean));

        /*if ($state.current.name === 'tenant.feed.rating.instance' && $state.params.feeds) {
            var deregister = $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
                vm.props = allProps[params.feedType];
                vm.feedTypeLabel = allLabels[params.feedType];
                if (!ratingPromise && newState.name === 'tenant.feed.rating.instance' && params.feeds && params.feeds.length) {
                    updateRating(_.filter(params.feeds.split(':'), Boolean));
                }
                deregister();
            });
        }*/
    }
})();