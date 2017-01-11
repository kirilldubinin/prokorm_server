(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogController', CatalogController);

    function CatalogController($state, feedHttp) {
    	var vm = this;

    	feedHttp.getCatalog().then(function (items) {
    		vm.catalogItems = items;
    	});

    	vm.onItemClick = function (catalogItem) {
    		$state.go('farm.instance.catalog.instance', { 'terms': catalogItem.key });
    	};
    }
})();