(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogContentEditController', CatalogContentEditController);

    function CatalogContentEditController($state, catalogFactory) {
        var vm = this;
        vm.save = function () {
            catalogFactory.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem) {
                $state.go('farm.instance.catalog.instance', {'terms': $state.params.terms});
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