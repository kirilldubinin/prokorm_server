(function() {
    // modules
    'use strict';
    angular.module('feed')
    	.constant('FEED_TYPES',[
            {
                value: 'none',
                name: 'Нет'
            },
            {
                value: 'haylage',
                name: 'Сенаж'
            },
            {
                value: 'silage',
                name: 'Силос'
            },
            {
                value: 'grain',
                name: 'Зерно'
            },
            {
                value: 'cornSilage',
                name: 'Силосованное зерно'
            },
            {
                value: 'straw',
                name: 'Солома'
            },
            {
                value: 'hay',
                name: 'Сено'
            },
            {
                value: 'oilcake',
                name: 'Жмых'
            },
            {
                value: 'meal',
                name: 'Шрот'
            },
            {
                value: 'greenWeight',
                name: 'Зеленая масса'
            },
            {
                value: 'tmr',
                name: 'TMR'
            }
        ]);
    angular.module('feed')
    	.constant('STORAGE_TYPES',[
            {
                value: 'silo',
                name: 'Траншея'
            },
            {
                value: 'mound',
                name: 'Курган'
            },
            {
                value: 'polymerSleeve',
                name: 'Полимерный рукав'
            },
            {
                value: 'polymerCoil',
                name: 'Полимерный рулон'
            }
        ]);
})();