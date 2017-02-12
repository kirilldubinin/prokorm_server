(function() {
    'use strict';
    angular.module('prokorm').controller('HomeController', HomeController);
    /** @ngInject */
    function HomeController($scope, $state,  loginFactory, $mdDialog) {
        var originatorEv;
        var vm = this;
        vm.currentModule = '';
        loginFactory.getSessionData().then(function(data) {
            vm.sessionData = data;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToModule = function(module) {
            $state.go('farm.instance.' + module);
            //$window.location.href = '#/farm/kamenskoe' + module.url;
        };

        vm.logout = function () {
            loginFactory.logout();
        };

        vm.profile = function () {
            $state.go('farm.instance.profile.view');
        };

        vm.help = function () {
            $state.go('farm.instance.help');
        }; 

        vm.info = function () {
            $state.go('farm.instance.info');
        };        

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.currentModule = newState.data && newState.data.module;
        });
    }
})();