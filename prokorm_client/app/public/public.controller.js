(function() {
    'use strict';
    angular.module('prokorm').controller('PublicController', PublicController);
    function PublicController($state, authFactory) {
        var vm = this;

        if ($state.current.name === 'public') {
            $state.go('public.view');
            vm.current = 'view';    
        } else {
            vm.current = $state.current.name.split('.')[1];
        }
        
        vm.buttons = [{
        	name: 'анализы',
        	key: 'view',
        	url: '/#/view'
        }, {
        	name: 'сравнение',
        	key: 'diff',
        	url: '/#/diff'
        }, {
        	name: 'среднее',
        	key: 'average',
        	url: '/#/average'
        }, {
        	name: 'сумма',
        	key: 'sum',
        	url: '/#/sum'
        }, {
            name: 'рейтинг',
            key: 'rating',
            url: '/#/rating'
        }, {
            name: 'аналитика',
            key: 'charts',
            url: '/#/charts'
        }];
    }
})();