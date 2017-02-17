(function() {
    'use strict';
    angular.module('admin').controller('AdminController', AdminController);
    /** @ngInject */
    function AdminController($scope, adminFactory) {
        
        var vm = this;
        adminFactory.getTenants().then(function (tenants) {
        	vm.tenants = tenants;
        });
    }
})();