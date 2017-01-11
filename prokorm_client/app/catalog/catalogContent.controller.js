(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogContentController', CatalogContentController);

    function CatalogContentController($state, feedHttp) {
    	var vm = this;

    	if (!$state.params.terms) {
    		return;
    	}
    	feedHttp.getCatalogContentByKey($state.params.terms).then(function (catalogItem) {
    		vm.catalogItem = catalogItem;
    	});
    }
})();