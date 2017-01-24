(function() {
    'use strict';
    angular.module('prokorm').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, sessionData, loginFactory) {
        var vm = this;

        vm.tenantName = $state.params.tenant;
        vm.user = {
            tenantname: vm.tenantName || '',
            username: '',
            password: ''
        };
        vm.do = function () {
            loginFactory.login(vm.user).then(
                function(response) {
                    // set session user
                    sessionData.setSessionUser(response);
                    $state.go('farm.instance.feed', { 'id': response.tenantName });
                }, function (err) {
                    vm.info = err.message;
                }
            );
        }

        vm.goToRegistration = function () {
            
        }
    }
})();