(function() {
    'use strict';
    angular.module('prokorm').controller('CatalogContentEditController', CatalogContentEditController);

    function CatalogContentEditController($state, feedHttp) {
        var vm = this;
        vm.save = function () {
            feedHttp.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem) {
                $state.go('farm.instance.catalog.instance', {'terms': $state.params.terms})
            });
        }
        if (!$state.params.terms) {
            return;
        }
        feedHttp.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });

    }
})();