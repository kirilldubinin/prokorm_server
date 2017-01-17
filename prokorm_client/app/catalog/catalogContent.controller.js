(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogContentController', CatalogContentController);

    function CatalogContentController($state, feedHttp) {
        var vm = this;

        vm.edit = function () {
            $state.go('farm.instance.catalog.edit', {'terms': $state.params.terms});
        }
        if (!$state.params.terms) {
            return;
        }
        feedHttp.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });
    }
})();