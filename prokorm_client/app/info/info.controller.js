(function() {
    'use strict';
    angular.module('info').controller('InfoController', InfoController);
    /** @ngInject */
    function InfoController($scope, $state, version) {
    	var vm = this;
        vm.version = version;
    }
})();