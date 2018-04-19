(function() {
    'use strict';
    angular.module('prokorm').controller('PublicController', PublicController);
    function PublicController($state, authFactory) {
        var vm = this;

        if ($state.current.name === 'public') {
            $state.go('public.list');
            vm.current = 'list';    
        } else {
            vm.current = $state.current.name.split('.')[1];
        }
        
        vm.buttons = [{
            name: 'список',
            key: 'list',
            url: '/#/list'
        }, {
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
            name: 'планирование',
            key: 'planning',
            url: '/#/planning'
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