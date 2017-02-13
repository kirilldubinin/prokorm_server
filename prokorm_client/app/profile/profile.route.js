(function() {
    'use strict';
    angular.module('profile').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.profile', {
                url: '/profile',
                templateUrl: 'app/profile/profileRoot/profile.html',
                abstract: true
            }).state('tenant.profile.view', {
                url: '/view',
                templateUrl: 'app/profile/profileView/profileView.html',
                controller: 'ProfileViewController',
                controllerAs: 'profileView',
                data: {
                    module: 'profile'
                }
            }).state('tenant.profile.addUser', {
                url: '/addUser',
                templateUrl: 'app/profile/addUser/addUser.html',
                controller: 'AddUserController',
                controllerAs: 'addUser',
                data: {
                    module: 'profile'
                }
            }).state('tenant.profile.edit', {
                url: '/edit',
                templateUrl: 'app/profile/profileEdit/profileEdit.html',
                controller: 'ProfileEditController',
                controllerAs: 'profileEdit',
                data: {
                    module: 'profile'
                }
            })
    }
})();