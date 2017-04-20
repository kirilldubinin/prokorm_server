(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, $mdDialog) {
        var vm = this;
        
        vm.rationItems = [
            {
                type: 'Раздой',
                name: '20-100 дней',
                description: '',
                targetCow: {
                    group: 'Раздой 20-100',
                    milkYield: 32,
                    weight: 600
                },
                start: '12 Apr 2016',
                end: '',
                inProgress: true
            }
        ]

        /*rationFactory.getRations().then(function(result) {
            vm.rationItems = result.rations;
        });*/

        vm.onRationClick = function(feedItem) {
            
        };
    }
})();