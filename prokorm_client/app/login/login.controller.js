(function() {
    'use strict';
    angular.module('prokorm').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, sessionData, feedHttp) {
        var vm = this;
        vm.user = {
            tenantname: '',
            username: '',
            password: ''
        };
        vm.do = function () {
            feedHttp.login(vm.user).then(
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