(function() {
    'use strict';
    angular.module('prokorm').controller('HomeController', HomeController);
    /** @ngInject */
    function HomeController($scope, $state, authFactory, $mdDialog) {
        var originatorEv;
        var vm = this;
        vm.currentModule = '';
        authFactory.getSessionData().then(function(data) {
            vm.sessionData = data;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToModule = function(module) {
            $state.go('tenant.' + module);
            //$window.location.href = '#/farm/kamenskoe' + module.url;
        };

        vm.logout = function () {
            authFactory.logout();
        };

        vm.profile = function () {
            $state.go('tenant.profile.view');
        };

        vm.help = function () {
            $state.go('tenant.help');
        }; 

        vm.info = function () {
            $state.go('tenant.info');
        };        

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.currentModule = newState.data && newState.data.module;
        });
    }
})();