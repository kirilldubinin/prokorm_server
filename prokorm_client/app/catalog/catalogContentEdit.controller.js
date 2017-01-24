(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogContentEditController', CatalogContentEditController);

    function CatalogContentEditController($state, feedFactory) {
        var vm = this;
        vm.save = function () {
            feedFactory.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem) {
                $state.go('farm.instance.catalog.instance', {'terms': $state.params.terms})
            });
        }
        if (!$state.params.terms) {
            return;
        }
        feedFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });

    }
})();