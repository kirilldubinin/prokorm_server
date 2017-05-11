(function() {
    'use strict';
    RationViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'feedFactory', '_']
    angular.module('ration').controller('RationViewController', RationViewController);

    function RationViewController($mdDialog, $stateParams, $state, authFactory, feedFactory, _) {
        var vm = this;
        
    }
})();