(function() {
    'use strict';
    
    // modules
    angular.module('prokorm', ['ngResource', 'ui.router', 'ngMaterial', 'ngMdIcons']);

    // config
    angular.module('prokorm').config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
       return moment(date).format('DD-MM-YYYY');
    };
}]);
})();