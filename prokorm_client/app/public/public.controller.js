(function() {
    'use strict';
    angular.module('prokorm').controller('PublicController', PublicController);
    function PublicController($state, authFactory) {
        var vm = this;
        $state.go('public.view');
        vm.current = 'view';
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