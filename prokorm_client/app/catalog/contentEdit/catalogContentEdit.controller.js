(function() {
    'use strict';
    angular.module('catalog').controller('CatalogContentEditController', CatalogContentEditController);

    function CatalogContentEditController($state, catalogFactory) {
        var vm = this;
        vm.save = function () {
            catalogFactory.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem) {
                $state.go('tenant.catalog.instance', {'terms': $state.params.terms});
            });
        };
        if (!$state.params.terms) {
            return;
        }
        catalogFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });

    }
})();