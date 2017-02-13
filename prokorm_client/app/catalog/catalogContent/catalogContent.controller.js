(function() {
    'use strict';
    angular.module('catalog').controller('CatalogContentController', CatalogContentController);

    function CatalogContentController($state, catalogFactory) {
        var vm = this;

        vm.edit = function () {
            $state.go('tenant.catalog.edit', {'terms': $state.params.terms});
        };
        if (!$state.params.terms) {
            return;
        }
        catalogFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });
    }
})();