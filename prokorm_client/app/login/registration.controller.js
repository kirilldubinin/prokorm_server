(function() {
    'use strict';
    angular.module('prokorm').controller('RegistrationController', RegistrationController);
    /** @ngInject */
    function RegistrationController($http) {
        var vm = this;
        vm.user = {
            loginname: '',
            email: ''
        };
        vm.do = function () {
            vm.error = '';
            $http.post('http://localhost:8080/api/registration', vm.user).then(
                function(response) {
                    if (response.data && response.data.message) {
                        vm.successMessage = response.data.message;
                    }
                }, 
                function(err) {
                    vm.error = err;
                }
            );
        }

        vm.goToRegistration = function () {
            
        }
    }
})();