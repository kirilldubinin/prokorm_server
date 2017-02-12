(function() {
    'use strict';
    angular.module('prokorm').controller('InfoController', InfoController);
    /** @ngInject */
    function InfoController($scope, $state, version) {
    	var vm = this;
        vm.version = version;
    }
})();