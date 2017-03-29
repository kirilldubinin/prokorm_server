(function() {
    'use strict';
    angular.module('auth').controller('ForgetController', ForgetController);
    /** @ngInject */
    function ForgetController(authFactory) {
        var vm = this;
        vm.email = '';
        vm.userName = '';
        vm.tenantName = ''
        vm.do = function () {
            authFactory.forgetPassword({
                email: vm.email
                //userName: vm.userNam,
                //tenantName: vm.tenantName
            }).then(function (result) {
                vm.successMessage = result.message;
            });
        };
    }
})();