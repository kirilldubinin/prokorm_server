(function() {
    'use strict';
    angular.module('prokorm').controller('HomeController', HomeController);
    /** @ngInject */
    function HomeController($state, feedHttp, $mdDialog) {
        var originatorEv;
        var vm = this;
        feedHttp.getSessionData().then(function(data) {
            vm.sessionData = data;
        });
        vm.modules = [{
            name: 'Здания',
            img: 'img/ic_home_white_48px.svg',
            url: '/building'
        }, {
            name: 'Корма',
            img: 'img/ic_layers_white_48px.svg',
            url: '/feed'
        }, {
            name: 'Рационы',
            img: 'img/ic_chrome_reader_mode_white_48px.svg',
            url: '/ration'
        }, {
            name: 'Молоко',
            img: 'img/ic_opacity_white_48px.svg',
            url: '/milk'
        }];
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.onModuleClick = function(module) {
            //$window.location.href = '#/farm/kamenskoe' + module.url;
        }

        vm.logout = function () {
            feedHttp.logout();
        }
    }
})();