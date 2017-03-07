(function() {
    'use strict';
    angular.module('admin').controller('AdminController', AdminController);
    /** @ngInject */
    function AdminController($state, $scope, adminFactory) {
        
        var vm = this
        vm.goToTenantInfo = function (_id) {
        	$state.go('admin.tenant', {
        		tenant_id: _id
        	});
        };
        adminFactory.getTenants().then(function (tenants) {
        	vm.tenants = tenants;
        });
    }
})();