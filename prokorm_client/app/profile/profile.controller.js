(function() {
    'use strict';
    angular.module('prokorm').controller('ProfileViewController', ProfileViewController);
    /** @ngInject */
    function ProfileViewController($scope, $state, loginFactory) {
        var vm = this;
        loginFactory.getProfileView().then(function (userInfo) {
        	vm.userInfo = userInfo;
        })
    }

    angular.module('prokorm').controller('ProfileEditController', ProfileEditController);
    /** @ngInject */
    function ProfileEditController($scope, $state, loginFactory) {
        var vm = this;
        loginFactory.getProfileEdit().then(function (userInfo) {
        	vm.userInfo = userInfo;
        })
    }
})();