(function() {
    'use strict';
    angular.module('prokorm').controller('RegistrationController', RegistrationController);
    /** @ngInject */
    function RegistrationController($http, feedFactory) {
        var vm = this;
        vm.user = {
            loginname: '',
            email: ''
        };
        vm.do = function () {
            vm.error = '';
            feedFactory.registration(vm.user).then(
                function(response) {
                    if (response && response.message) {
                        vm.successMessage = response.message;
                    }
                }, 
                function(err) {
                    vm.error = err.message;
                }
            );
        }

        vm.goToRegistration = function () {
            
        }
    }
})();