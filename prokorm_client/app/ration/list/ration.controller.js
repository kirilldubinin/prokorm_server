(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, $mdDialog) {
        var vm = this;
        
        vm.rationItems = [
            {
                type: 'раздой',
                target: '32 литра',
                name: '20-100 дней, двор 620-100 дней, двор 6',
                description: '',
                targetCow: {
                    group: 'Раздой 20-100',
                    weight: 600
                },
                start: '12 Apr 2016',
                end: '',
                inProgress: true
            },
            {
                type: 'сухостой',
                target: '12 литров',
                name: '200-260 дней, двор 4',
                description: '',
                targetCow: {
                    group: 'Раздой 20-100',
                    weight: 600
                },
                start: '12 Nov 2016',
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