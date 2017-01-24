(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogController', CatalogController);

    function CatalogController($state, catalogFactory) {
    	var vm = this;

    	catalogFactory.getCatalog().then(function (items) {
    		vm.catalogItems = items;
    	});

    	vm.onItemClick = function (catalogItem) {
    		$state.go('farm.instance.catalog.instance', { 'terms': catalogItem.key });
    	};
    }
})();