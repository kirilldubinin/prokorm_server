(function() {
    'use strict';
    angular.module('admin').controller('TenantController', TenantController);
    function TenantController($scope, $stateParams,  adminFactory) {
        var vm = this;

        if ($stateParams.tenant_id) {
        	adminFactory.getTenant($stateParams.tenant_id).then(function (tenant) {
	        	vm.info = tenant;
	        });	
        }
    }
})();