(function() {
    'use strict';
    angular.module('auth').controller('RegistrationController', RegistrationController);
    /** @ngInject */
    function RegistrationController($http, authFactory) {
        var vm = this;
        vm.user = {
            loginname: '',
            email: ''
        };
        vm.do = function () {
            vm.error = '';
            authFactory.registration(vm.user).then(
                function(response) {
                    if (response && response.message) {
                        vm.successMessage = response.message;
                    }
                }
            );
        };

        vm.goToRegistration = function () {
            
        };
    }
})();