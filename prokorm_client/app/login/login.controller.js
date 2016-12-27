(function() {
    'use strict';
    angular.module('prokorm').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, sessionData) {
        var vm = this;
        vm.user = {
            tenantname: 'prokorm',
            username: 'prokorm',
            password: 'yc5NhI'
        };
        vm.do = function () {
            $http.post('http://localhost:8080/api/signin', vm.user).then(
                function(response) {
                    if (response.data) {

                        // set session user
                        sessionData.setSessionUser(response.data);
                        $state.go('farm.instance.feed', { 'id': response.data.tenantName });
                    }
                }, function (err) {
                    vm.info = err.data.message;
                }
            );
        }

        vm.goToRegistration = function () {
            
        }
    }
})();