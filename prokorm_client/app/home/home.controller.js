(function() {
    'use strict';
    angular.module('prokorm').controller('HomeController', HomeController);
    /** @ngInject */
    function HomeController($scope, $state,  feedHttp, $mdDialog) {
        var originatorEv;
        var vm = this;
        vm.currentModule = '';
        feedHttp.getSessionData().then(function(data) {
            vm.sessionData = data;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToModule = function(module) {
            $state.go('farm.instance.' + module);
            //$window.location.href = '#/farm/kamenskoe' + module.url;
        }

        vm.logout = function () {
            feedHttp.logout();
        }

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.currentModule = newState.data.module;
        });
    }
})();