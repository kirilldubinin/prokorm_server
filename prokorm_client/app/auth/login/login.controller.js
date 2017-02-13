(function() {
    'use strict';
    angular.module('auth').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, loginFactory) {
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
                    $state.go('tenant.feed', { 'id': response.tenantName });
                }, function (err) {
                    vm.info = err.message;
                }
            );
        };

        vm.goToRegistration = function () {
            
        };
    }
})();