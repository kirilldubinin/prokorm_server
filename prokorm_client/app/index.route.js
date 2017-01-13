(function() {
  'use strict';

  angular.module('prokorm').config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('farm', {
        url: '/farm',
        abstract: true,
        templateUrl: 'app/rootTemplate.html',
      })
      .state('farm.registration', {
        url: '/registration',
        templateUrl: 'app/login/registration.html',
        controller: 'RegistrationController',
        controllerAs: 'registration'  
      })
      .state('farm.login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('farm.login.tenant', {
        url: '/:tenant',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login',
        params: {
          tenant: undefined
        }
      })
      .state('farm.instance', {
        url: '/:id',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home',
        abstract: true,
        params: {
          id: undefined
        }
      })
      // ration =======================================================
      .state('farm.instance.ration', {
        url: '/ration',
        templateUrl: 'app/ration/ration.html',
        controller: 'RationController',
        controllerAs: 'ration',
        data: {
          module: 'ration'
        }
      })
      .state('farm.instance.ration.instance', {
        url: '/:rationId',
        templateUrl: 'app/ration/rationView/rationView.html',
        controller: 'RationViewController',
        controllerAs: 'rationView',
        params: {
          rationId: undefined
        },
        data: {
          module: 'catalog'
        }
      })
      // catalog =======================================================
      .state('farm.instance.catalog', {
        url: '/catalog',
        templateUrl: 'app/catalog/catalog.html',
        controller: 'CatalogController',
        controllerAs: 'catalog',
        data: {
          module: 'catalog'
        }
      })
      .state('farm.instance.catalog.instance', {
        url: '/:terms',
        templateUrl: 'app/catalog/catalogContent.html',
        controller: 'CatalogContentController',
        controllerAs: 'catalogContent',
        params: {
          terms: undefined
        },
        data: {
          module: 'catalog'
        }
      })
      // feed ==========================================================
      .state('farm.instance.feed', {
        url: '/feed',
        templateUrl: 'app/feed/feedList/feed.html',
        controller: 'FeedController',
        controllerAs: 'feed',
        data: {
          module: 'feed'
        }
      })
      .state('farm.instance.feed.diff', {
        url: '/diff/:feeds',
        templateUrl: 'app/feed/diff/diff.html',
        controller: 'DiffController',
        controllerAs: 'diff',
        params: {
          feeds: undefined
        },data: {
          module: 'feed'
        }
      })
      .state('farm.instance.feed.average', {
        url: '/average/:feeds',
        templateUrl: 'app/feed/average/average.html',
        controller: 'AverageController',
        controllerAs: 'average',
        params: {
          feeds: undefined
        },data: {
          module: 'feed'
        }
      })
      .state('farm.instance.feed.new', {
        url: '/new',
        templateUrl: 'app/feed/feedEdit/feedEdit.html',
        controller: 'FeedEditController',
        controllerAs: 'feedEdit',
        data: {
          module: 'feed'
        }
      }).state('farm.instance.feed.edit', {
        url: '/:feedId/edit',
        templateUrl: 'app/feed/feedEdit/feedEdit.html',
        controller: 'FeedEditController',
        controllerAs: 'feedEdit',
        params: {
          feedId: undefined
        },
        data: {
          module: 'feed'
        }
      }).state('farm.instance.feed.instance', {
        url: '/:feedId',
        templateUrl: 'app/feed/feedView/feedView.html',
        controller: 'FeedViewController',
        controllerAs: 'feedView',
        params: {
          feedId: undefined
        },
        data: {
          module: 'feed'
        }
      });

    /*$stateProvider.state('home', {
      url: '/home',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    });

    $stateProvider.state('farm', {
      url: '/farm',
      templateUrl: 'app/farm/farm.html',
      controller: 'FarmController',
      controllerAs: 'farm'
    });
    $stateProvider.state('farm.feed', {
      url: '/feed',
      templateUrl: 'app/feed/feed.html',
      controller: 'FeedController',
      controllerAs: 'feed'
    });

    $stateProvider.state('group', {
      url: '/group',
      templateUrl: 'app/group/group.html',
      controller: 'GroupController',
      controllerAs: 'group'
    });*/



    $urlRouterProvider.otherwise('/');
  }

})();
