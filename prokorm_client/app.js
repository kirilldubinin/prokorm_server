(function() {
    'use strict';
    // modules
    angular.module('auth', []);
    angular.module('feed', []);
    angular.module('profile', []);
    angular.module('catalog', []);
    angular.module('info', []);
    angular.module('help', []);
    angular.module('admin', []);
    angular.module('prokorm', ['ngResource', 'ui.router', 'ngMaterial', 'ngMdIcons', 'ui.carousel',
        'catalog', 'profile', 'feed', 'auth', 'help', 'info', 'admin']);
    // constant
    angular.module('prokorm').constant('_', window._);
    // config
    angular.module('prokorm').config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };
    }]);
    angular.module('prokorm').config(['$httpProvider', function($httpProvider) {

        var dialog;
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors
        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';
        var lastTenantName;

        function isAPIrequest(url) {
            return /^\/?api\//.test(url);
        }
        $httpProvider.interceptors.push(function($q, $injector) {
            return {
                // optional method
                'request': function(config) {
                    // do something on success
                    return config;
                },
                // optional method
                'requestError': function(rejection) {
                    return $q.reject(rejection);
                },
                // optional method
                'response': function(response) {
                    if (isAPIrequest(response.config.url)) {
                        return response.data;
                    }
                    return response;
                },
                // optional method
                'responseError': function(rejection) {
                    if (rejection.status === 401) {
                        $injector.get('$state').transitionTo('login');
                    }
                    if (isAPIrequest(rejection.config.url)) {

                        dialog = dialog || $injector.get('$mdDialog');
                        if (rejection.status !== 401 && rejection.data.message) {
                            dialog.show(
                                dialog
                                .alert()
                                .clickOutsideToClose(false)
                                .title('Ошибка')
                                .textContent(rejection.data.message)
                                .ok('Закрыть')
                            );
                            //alert(rejection.data.message);
                        }
                        return $q.reject(rejection.data);
                    }
                    return $q.reject(rejection);
                }
            };
        });
        // This will automatically convert all strings in server JSON responses to date
        //var regexIso8601 = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
        var regexIso8601 = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;
        $httpProvider.defaults.transformResponse.push(function(responseData) {
            convertDateStringsToDates(responseData);
            return responseData;
        });

        function convertDateStringsToDates(input) {
            // Ignore things that aren't objects.
            if (typeof input !== "object") return input;
            for (var key in input) {
                if (!input.hasOwnProperty(key)) continue;
                var value = input[key];
                var match;
                // Check for string properties which look like dates.
                // TODO: Improve this regex to better match ISO 8601 date strings.
                if (typeof value === "string" && (match = value.match(regexIso8601))) {
                    // Assume that Date.parse can parse ISO 8601 strings, or has been shimmed in older browsers to do so.
                    var milliseconds = Date.parse(match[0]);
                    if (!isNaN(milliseconds)) {
                        input[key] = new Date(milliseconds);
                    }
                } else if (typeof value === "object") {
                    // Recurse into object
                    convertDateStringsToDates(value);
                }
            }
        }
    }]);
})();
(function() {
    'use strict';
    angular.module('prokorm').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('eula', {
                url: '/eula',
                templateUrl: 'app/public/eula.html'
            })
            .state('conditions', {
                url: '/conditions',
                templateUrl: 'app/public/conditions.html'
            })
            .state('public', {
                url: '',
                templateUrl: 'app/public/public.html',
                controller: 'PublicController',
                controllerAs: 'public'
            }).state('public.view', {
                url: '/view',
                templateUrl: 'app/feed/view/feedView.html',
                controller: 'FeedViewDemoController',
                controllerAs: 'feedView'
            }).state('public.diff', {
                url: '/diff',
                templateUrl: 'app/feed/diff/diff.html',
                controller: 'DiffDemoController',
                controllerAs: 'diff'
            }).state('public.average', {
                url: '/average',
                templateUrl: 'app/feed/average/average.html',
                controller: 'AverageDemoController',
                controllerAs: 'average'
            }).state('public.sum', {
                url: '/sum',
                templateUrl: 'app/feed/sum/sum.html',
                controller: 'SumDemoController',
                controllerAs: 'sum'
            }).state('public.rating', {
                url: '/rating',
                templateUrl: 'app/feed/rating/ratingInstance.html',
                controller: 'RatingDemoController',
                controllerAs: 'rating'
            }).state('public.charts', {
                url: '/charts',
                templateUrl: 'app/feed/charts/charts.html',
                controller: 'ChartsDemoController',
                controllerAs: 'charts'
            })
            .state('tenant', {
                url: '/:id',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'home',
                abstract: true,
                params: {
                    id: undefined
                }
            });
        //$urlRouterProvider.otherwise('/');
    }
})();
(function () { 
 return angular.module("prokorm")
.constant("version", "0.0.75");

})();

/* global malarkey:false, moment:false 
(function() {
  'use strict';

  angular
    .module('prokorm')
    .constant('malarkey', malarkey)
    .constant('moment', moment);

})();
*/

(function() {
  'use strict';

  angular
    .module('prokorm')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope) {
  	$rootScope._ = window._;
  }

})();

(function() {
    'use strict';
    angular.module('admin').controller('AdminController', AdminController);
    /** @ngInject */
    function AdminController($state, $scope, adminFactory) {
        
        var vm = this
        vm.goToTenantInfo = function (_id) {
        	$state.go('admin.tenant', {
        		tenant_id: _id
        	});
        };
        adminFactory.getTenants().then(function (tenants) {
        	vm.tenants = tenants;
        });
    }
})();
angular.module('admin').factory('adminFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var adminFactory = {};
    adminFactory.getTenants = function () {
        return $http.get(urlBase + 'tenants');
    };
    adminFactory.getTenant = function (_id) {
        return $http.get(urlBase + 'tenants/' + _id);
    };
    return adminFactory;
}]);
(function() {
    'use strict';
    angular.module('admin').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'admin',
                data: {
                    module: 'admin'
                }
            }).state('admin.tenant', {
                url: '/:tenant_id',
                templateUrl: 'app/admin/tenant.html',
                controller: 'TenantController',
                controllerAs: 'tenant',
                params: {
                    tenant_id: undefined
                },
                data: {
                    module: 'admin'
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('admin').controller('TenantController', TenantController);
    function TenantController($scope, $stateParams,  adminFactory) {
        var vm = this;

        if ($stateParams.tenant_id) {
        	adminFactory.getTenant($stateParams.tenant_id).then(function (tenant) {
	        	vm.info = tenant;
	        });	
        }
    }
})();
angular.module('auth').factory('authFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var authFactory = {};

    authFactory.logout = function() {
        return $http.post(urlBase + 'logout/');
    };

    authFactory.login = function(user) {
        return $http.post(urlBase + 'signin/', user);
    };

    authFactory.registration = function(user) {
        return $http.post(urlBase + 'registration/', user);
    };

    // sessionData
    authFactory.getSessionData = function() {
        return $http.get(urlBase + 'sessionData/');
    };

    // profile
    authFactory.getProfileView = function() {
        return $http.get(urlBase + 'profile/view/');
    };    
    authFactory.getProfileEdit = function() {
        return $http.get(urlBase + 'profile/edit');
    };
    authFactory.updateProfile = function(profile) {
        return $http.put(urlBase + 'profile/', profile);
    };
    authFactory.addUser = function(user) {
        return $http.post(urlBase + 'users/', user);
    };
    authFactory.setPassword = function (pass) {
        return $http.post(urlBase + 'profile/password/', pass);    
    };
    authFactory.forgetPassword = function (pass) {
        return $http.post(urlBase + 'forget/', pass);    
    };

    return authFactory;
}]);
(function() {
    'use strict';
    angular.module('auth').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'app/auth/registration/registration.html',
                controller: 'RegistrationController',
                controllerAs: 'registration'
            }).state('login', {
                url: '/login',
                templateUrl: 'app/auth/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login'
            }).state('forget', {
                url: '/forget',
                templateUrl: 'app/auth/forget/forget.html',
                controller: 'ForgetController',
                controllerAs: 'forget'
            }).state('login.tenant', {
                url: '/:tenant',
                templateUrl: 'app/auth/login/login.html',
                controller: 'LoginController',
                controllerAs: 'login',
                params: {
                    tenant: undefined
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('auth').controller('ForgetController', ForgetController);
    /** @ngInject */
    function ForgetController(authFactory) {
        var vm = this;
        vm.email = '';
        vm.userName = '';
        vm.tenantName = ''
        vm.do = function () {
            authFactory.forgetPassword({
                email: vm.email,
                userName: vm.userNam,
                tenantName: vm.tenantName
            }).then(function (result) {

            });
        };
    }
})();
(function() {
    'use strict';
    angular.module('auth').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, authFactory) {
        var vm = this;

        vm.tenantName = $state.params.tenant;
        vm.user = {
            tenantname: vm.tenantName || '',
            username: '',
            password: ''
        };
        vm.do = function () {
            authFactory.login(vm.user).then(
                function(response) {
                    $state.go('tenant.feed', { 'id': response.tenantName });
                }, function (err) {
                    vm.info = err.message;
                }
            );
        };
    }
})();
(function() {
    'use strict';
    angular.module('auth').controller('RegistrationController', RegistrationController);
    /** @ngInject */
    function RegistrationController($http, authFactory) {
        var vm = this;
        vm.user = {
            loginname: '',
            email: ''
        };
        vm.do = function () {
            vm.error = '';
            authFactory.registration(vm.user).then(
                function(response) {
                    if (response && response.message) {
                        vm.successMessage = response.message;
                    }
                }
            );
        };

        vm.goToRegistration = function () {
            
        };
    }
})();
angular.module('catalog').factory('catalogFactory', ['$http', '$location', function($http, $location) {

	var host = '';
    var urlBase = host + '/api/';
    var catalogFactory = {};
    catalogFactory.getCatalog = function () {
        return $http.get(urlBase + 'catalog');
    };
    catalogFactory.getCatalogContentByKey = function (key) {
        return $http.get(urlBase + 'catalog/' + key);
    };  
    catalogFactory.saveCatalogContentByKey = function (catalog) {
        return $http.put(urlBase + 'catalog/' + catalog.key, catalog);
    };

    return catalogFactory;
}]);
(function() {
    'use strict';
    angular.module('catalog').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.catalog', {
                url: '/catalog',
                templateUrl: 'app/catalog/list/catalog.html',
                controller: 'CatalogController',
                controllerAs: 'catalog',
                data: {
                    module: 'catalog'
                }
            }).state('tenant.catalog.edit', {
                url: '/:terms/edit',
                templateUrl: 'app/catalog/contentEdit/catalogContentEdit.html',
                controller: 'CatalogContentEditController',
                controllerAs: 'catalogContentEdit',
                params: {
                    terms: undefined
                },
                data: {
                    module: 'catalog'
                }
            }).state('tenant.catalog.instance', {
                url: '/:terms',
                templateUrl: 'app/catalog/content/catalogContent.html',
                controller: 'CatalogContentController',
                controllerAs: 'catalogContent',
                params: {
                    terms: undefined
                },
                data: {
                    module: 'catalog'
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('catalog').controller('CatalogContentController', CatalogContentController);

    function CatalogContentController($state, catalogFactory) {
        var vm = this;

        vm.edit = function () {
            $state.go('tenant.catalog.edit', {'terms': $state.params.terms});
        };
        if (!$state.params.terms) {
            return;
        }
        catalogFactory.getCatalogContentByKey($state.params.terms).then(function(catalogItem) {
            vm.catalogItem = catalogItem;
        });
    }
})();
(function() {
    'use strict';
    angular.module('catalog').controller('CatalogContentEditController', CatalogContentEditController);

    function CatalogContentEditController($state, catalogFactory) {
        var vm = this;
        vm.save = function () {
            catalogFactory.saveCatalogContentByKey(vm.catalogItem).then(function(catalogItem) {
                $state.go('tenant.catalog.instance', {'terms': $state.params.terms});
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
(function() {
    'use strict';
    angular.module('catalog').controller('CatalogController', CatalogController);

    function CatalogController($state, catalogFactory) {
    	var vm = this;
        vm.currentKey = $state.params.terms;
    	catalogFactory.getCatalog().then(function (items) {
    		vm.catalogItems = items;
    	});

    	vm.onItemClick = function (catalogItem) {
            vm.currentKey = catalogItem.key;
    		$state.go('tenant.catalog.instance', { 'terms': catalogItem.key });
    	};
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('AverageController', AverageController);

    function AverageController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateAverageRows(feedsForAverage) {

    		if (!feedsForAverage.length) {
    			vm.averageRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.averageFeeds(feedsForAverage).then(function (result) {
                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.analysisRows = result.analysis;
                vm.averageRows = result.average;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.average') {
                updateAverageRows(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('AverageDemoController', AverageDemoController);

    function AverageDemoController(feedFactory, _) {

    	var vm = this;
    	vm.propertiesForDiff = [];
        vm._ = _;

        feedFactory.averageDemoFeeds().then(function (result) {
            vm.dryRawValues = result.dryRawValues;
            vm.headers = result.headers;
            vm.analysisRows = result.analysis;
            vm.averageRows = result.average;
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('ChartsController', ChartsController);

    function ChartsController($scope, feedFactory, $stateParams, _) {
        var vm = this;
        function updateCharts() {

            if (!vm.feeds || !vm.feeds.length) {
                return;
            }

            feedFactory.chartsFeeds(vm.feeds).then(function(data) {
                Highcharts.chart('container', {
                    legend: {
                        itemStyle: {
                            fontWeight: '500'
                        },
                        itemDistance: 40,
                        itemMarginBottom: 10,
                    },
                    chart: {
                        type: 'spline'
                    },
                    title: false,
                    plotOptions: {
                        spline: {
                            lineWidth: 4,
                            states: {
                                hover: {
                                    lineWidth: 5
                                }
                            },
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: false
                    },
                    series: data.chartSeries
                });
            });
        }   

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.charts') {
                vm.feeds = _.filter(params.feeds.split(':'), Boolean);
                updateCharts();
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('ChartsDemoController', ChartsDemoController);

    function ChartsDemoController($scope, feedFactory, $stateParams, _) {
        var vm = this;
        vm.feeds = ['fake'];
        feedFactory.chartsDemoFeeds().then(function(data) {
            Highcharts.chart('container', {
                legend: {
                    itemStyle: {
                        fontWeight: '500'
                    },
                    itemDistance: 40,
                    itemMarginBottom: 10,
                },
                chart: {
                    type: 'spline'
                },
                title: false,
                plotOptions: {
                    spline: {
                        lineWidth: 4,
                        states: {
                            hover: {
                                lineWidth: 5
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                },
                xAxis: {
                    categories: data.categories
                },
                yAxis: {
                    title: false
                },
                series: data.chartSeries
            });
        });
    }
})();
(function() {
  angular.module('feed').directive('groupButtons', groupButtons);
  function groupButtons() {
      var directive = {
          restrict: 'E',
          templateUrl: 'app/feed/controls/groupButtons/groupButtons.html',
          scope: {
            items: '=',
            allowAdd: '=',
            onAdd: '&',
            onDelete: '&',
            onSelect: '&'
          },
          replace: true,    
          controller: GroupButtonsController,
          controllerAs: 'groupButtons',
          bindToController: true
      };
      return directive;
  }

  function GroupButtonsController($scope) {

    var self = this;
    
    $scope.items = self.items;
    $scope.$watchCollection('items.length', function () {

      console.log(self.items.length);
      self.selected = _.last(self.items);
      self.onSelect({item: self.selected});  
    }, true);

    self.onClick = function (item) {
      console.log(self.items.length);
      self.selected = item;
      self.onSelect({item: self.selected});
    };
  }
})();
(function() {
    'use strict';
    angular.module('feed').controller('DiffController', DiffController);

    function DiffController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.diffFeeds(feedsForDiff).then(function (result) {

                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.diff') {
                updateDiffRows(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('DiffDemoController', DiffDemoController);
    function DiffDemoController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        feedFactory.diffDemoFeeds().then(function (result) {

            vm.dryRawValues = result.dryRawValues;
            vm.headers = result.headers;
            vm.diffRows = result.diffs;
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('FeedEditController', FeedEdiController);
    /** @ngInject */
    function FeedEdiController($window, $stateParams, $state, $scope, feedFactory) {
        var vm = this;

        vm.feedItem = {
            analysis: []
        };

        vm.feedTypes = [
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
        ];

        vm.storageTypes = [
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
        ];

        vm.feedItemControls = [];
        var feedId = $stateParams.feedId;
        var promise = feedId ? feedFactory.getFeedEdit(feedId) : feedFactory.getEmptyFeed();
        promise.then(function(feed) {
            vm.feedItemSections = feed;
            //set analysis list
            vm.feedItem.analysis = _.map(feed[0].subSections, function(subSection) {
                return subSection.initialItem;
            });
        });

        vm.deleteCurrentAnalysis = function () {
            vm.feedItemSections[0].subSections = _.filter(vm.feedItemSections[0].subSections, 
                function (sebSection) {
                    return sebSection.initialItem !== vm.currentAnalysis;
                });

            //set analysis list
            vm.feedItem.analysis = _.map(vm.feedItemSections[0].subSections, function(subSection) {
                return subSection.initialItem;
            });
        };

        vm.onAnalysisAdd = function() {

            feedFactory.getEmptyAnalysis().then(function (newAnalysis) {
                // if no any analysis
                if (vm.feedItem.analysis && vm.feedItem.analysis.length) {
                    var max = _.max(_.map(vm.feedItem.analysis, 'number'));
                    newAnalysis.initialItem.number = max + 1;
                    vm.feedItem.analysis.push(newAnalysis);
                }

                vm.feedItemSections[0].subSections.push(newAnalysis);
                //set analysis list
                vm.feedItem.analysis = _.map(vm.feedItemSections[0].subSections, function(subSection) {
                    return subSection.initialItem;
                });
            });
        };
        vm.onAnalysisSelect = function(item) {
            vm.currentAnalysis = item;
        };
        vm.save = function() {

            var feed = {
                analysis: _.map(vm.feedItemSections[0].subSections, function (subSection) {
                    return subSection.initialItem;
                }),
                general: vm.feedItemSections[1].subSections[0].initialItem,
                harvest: vm.feedItemSections[2].subSections[0].initialItem,
                feeding: vm.feedItemSections[3].subSections[0].initialItem
            };

            if (feedId) {
                feed._id = feedId;
            }

            feedFactory.saveFeed(feed).then(function(response) {
                if (response.message === 'OK') {
                    $state.go('tenant.feed.instance', {
                        'feedId': response.id
                    });
                }
            });
        };
        vm.cancel = function() {
            if (feedId) {
                $state.go('tenant.feed.instance', {
                    'feedId': feedId
                });    
            } else {
                $state.go('tenant.feed'); 
            }
        };
        vm.onSelfExplanationLinkClick = function(key) {
            $state.go('farm.help', {
                'key': key
            });
        };
    }
})();
angular.module('feed').factory('feedFactory', ['$http', '$location', function($http, $location) {

    var host = '';
    var urlBase = host + '/api/';
    var urlBaseFeed = urlBase + 'feeds/';
    var feedFactory = {};

    // feed
    feedFactory.getFeeds = function() {
        return $http.get(urlBaseFeed);
    };
    feedFactory.getFeedDashboard = function() {
        return $http.get(urlBaseFeed + 'dashboard');
    };
    feedFactory.saveFeed = function(feed) {
        var methode = feed._id ? 'put' : 'post';
        var url = feed._id ? (urlBaseFeed + feed._id) : urlBaseFeed;
        return $http[methode](url, feed);
    };
    feedFactory.getFeedView = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/view');
    };
    feedFactory.getFeedViewDemo = function() {
        return $http.get(urlBaseFeed + 'viewDemo');
    };
    feedFactory.getFeedEdit = function(feedId) {
        return $http.get(urlBaseFeed + feedId + '/edit');
    };
    feedFactory.getEmptyFeed = function() {
        return $http.post(urlBaseFeed + 'new');
    };
    feedFactory.getEmptyAnalysis = function() {
        return $http.post(urlBaseFeed + 'newAnalysis');
    };
    feedFactory.deleteFeed = function(feedId) {
        return $http.delete(urlBaseFeed + feedId);
    };
    feedFactory.diffFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diff', {feedIds: feedIds});
    };
    feedFactory.diffDemoFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'diffDemo');
    };
    feedFactory.sumFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'sum', {feedIds: feedIds});
    };
    feedFactory.sumDemoFeeds = function() {
        return $http.post(urlBaseFeed + 'sumDemo');
    };
    feedFactory.averageFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'average', {feedIds: feedIds});
    };
    feedFactory.averageDemoFeeds = function() {
        return $http.post(urlBaseFeed + 'averageDemo');
    };
    feedFactory.chartsFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'charts', {feedIds: feedIds});
    };
    feedFactory.chartsDemoFeeds = function(feedIds) {
        return $http.post(urlBaseFeed + 'chartsDemo');
    };
    feedFactory.ratingFeeds = function (feedIds, feedType) {
        return $http.post(urlBaseFeed + 'rating', {feedIds: feedIds, feedType: feedType});
    };
    feedFactory.ratingDemoFeeds = function () {
        return $http.post(urlBaseFeed + 'ratingDemo');
    };
    return feedFactory;
}]);
(function() {
    'use strict';
    // modules
    
})();
(function() {
    'use strict';
    angular.module('feed').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.feed', {
                url: '/feed',
                templateUrl: 'app/feed/list/feed.html',
                controller: 'FeedController',
                controllerAs: 'feed',
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.charts', {
                url: '/charts/:feeds',
                templateUrl: 'app/feed/charts/charts.html',
                controller: 'ChartsController',
                controllerAs: 'charts',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.diff', {
                url: '/diff/:feeds',
                templateUrl: 'app/feed/diff/diff.html',
                controller: 'DiffController',
                controllerAs: 'diff',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.sum', {
                url: '/sum/:feeds',
                templateUrl: 'app/feed/sum/sum.html',
                controller: 'SumController',
                controllerAs: 'sum',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.average', {
                url: '/average/:feeds',
                templateUrl: 'app/feed/average/average.html',
                controller: 'AverageController',
                controllerAs: 'average',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.rating', {
                url: '/rating',
                templateUrl: 'app/feed/rating/rating.html',
                controller: 'RatingController',
                controllerAs: 'rating',
                params: {
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.rating.instance', {
                url: '/:feedType/:feeds',
                templateUrl: 'app/feed/rating/ratingInstance.html',
                controller: 'RatingController',
                controllerAs: 'rating',
                params: {
                    feedType: undefined,
                    feeds: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.new', {
                url: '/new',
                templateUrl: 'app/feed/edit/feedEdit.html',
                controller: 'FeedEditController',
                controllerAs: 'feedEdit',
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.edit', {
                url: '/:feedId/edit',
                templateUrl: 'app/feed/edit/feedEdit.html',
                controller: 'FeedEditController',
                controllerAs: 'feedEdit',
                params: {
                    feedId: undefined
                },
                data: {
                    module: 'feed'
                }
            }).state('tenant.feed.instance', {
                url: '/:feedId',
                templateUrl: 'app/feed/view/feedView.html',
                controller: 'FeedViewController',
                controllerAs: 'feedView',
                params: {
                    feedId: undefined
                },
                data: {
                    module: 'feed'
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('FeedController', FeedController);

    function FeedController($scope, $window, $state, feedFactory, $mdDialog) {
        var vm = this;
        vm.filter = {
            noAnalysis: true,
            showEmpty: true
        };
        var originatorEv;
        
        feedFactory.getFeeds().then(function(result) {
            vm.filterValues = result.filterValues;
            vm.feedItems = result.feeds;
            vm.selectedItemId = $state.params.feedId;
            vm.updateVisible();
        });

        feedFactory.getFeedDashboard().then(function(dashboard) {
            vm.dashboard = dashboard;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToHome = function() {
            vm.selectedItemId = null;
            $state.go('tenant.feed');
        };

        // actions
        vm.addFeed = function() {
            $state.go('tenant.feed.new');
        };
        vm.diffFeed = function() {
            $state.go('tenant.feed.diff');
        };
        vm.averageFeed = function() {
            $state.go('tenant.feed.average');
        };
        vm.sumFeed = function() {
            $state.go('tenant.feed.sum');
        };
        vm.chartsFeed = function() {
            $state.go('tenant.feed.charts');
        };
        vm.ratingFeed = function() {
            $state.go('tenant.feed.rating');
        };

        vm.isDisabled = function (feedItem) {
            if (vm.isDiffMode || vm.isAverageMode || vm.isChartMode || vm.isRatingMode) {
                return !Boolean(feedItem.analysis);
            } else if (vm.isSumMode) {
                return (!Boolean(feedItem.analysis) || !Boolean(feedItem.balanceWeight));
            }
            return false;
        };

        function isVisible(feedItem) {

            // by filter
            if (vm.filter) {

                // done
                if (!vm.filter.showEmpty && feedItem.done) {
                    return false;
                }

                // noAnalysis
                if (!vm.filter.noAnalysis && !feedItem.analysis) {
                    return false;
                }                

                // year            
                if (vm.filter.years && vm.filter.years.length) {
                    if (vm.filter.years.indexOf(feedItem.year) < 0) {
                        return false
                    }
                }
                // feedType
                if (vm.filter.feedTypes && vm.filter.feedTypes.length) {
                    if (vm.filter.feedTypes.indexOf(feedItem.feedType) < 0) {
                        return false
                    }
                }  
                // composition
                if (vm.filter.compositions && vm.filter.compositions.length) {
                    if (vm.filter.compositions.indexOf(feedItem.composition) < 0) {
                        return false
                    }
                }

                // branch
                if (vm.filter.branches && vm.filter.branches.length) {
                    if (vm.filter.branches.indexOf(feedItem.branch) < 0) {
                        return false
                    }
                }

                // storage
                if (vm.filter.storages && vm.filter.storages.length) {
                    if (vm.filter.storages.indexOf(feedItem.storage) < 0) {
                        return false
                    }
                }
            }

            return true;
        };

        vm.clearFilter = function () {
            vm.filter = {
                noAnalysis: true,
                showEmpty: true
            };
            vm.updateVisible();
        };

        vm.toggleFilter = function () {
            if (vm.filter.visible) {
                $state.go(vm.lastState, {
                  'feeds': []
                });
                vm.updateVisible();
            }
            vm.filter.visible = !vm.filter.visible;
        };

        vm.updateVisible = function () {
            _.forEach(vm.feedItems, function (feed) {
                feed.isVisible = isVisible(feed);
            });
            vm.hiddenItemsLength = _.size(_.filter(vm.feedItems, {'isVisible': false}));
        }

        vm.selectAll = function () {
            var ids = _.map(_.filter(vm.feedItems, function (feed) {
                return feed.isVisible && !vm.isDisabled(feed);
            }), '_id');
            $state.go(vm.lastState, {
                'feeds': ids.join(':')
            });
        }

        vm.onFeedClick = function(feedItem) {
            if (vm.isDiffMode || vm.isAverageMode || vm.isSumMode || vm.isChartMode || vm.isRatingMode) {

                var currentFeeds = _.filter($state.params.feeds.split(':'), function (o) { return o; });
                var ind = currentFeeds.indexOf(feedItem._id);

                if (ind > -1) {
                    currentFeeds.splice(ind, 1);
                } else {
                    currentFeeds.push(feedItem._id);
                }

                $state.go(vm.lastState, {
                  'feeds': currentFeeds.join(':')
                });
            } else {
                vm.selectedItemId = feedItem._id;
                $state.go('tenant.feed.instance', { 'feedId': feedItem._id });
            }
        };

        $scope.$on('stateChangeStart', function (oldState, newState) {

        });

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.lastState = newState.name;
            vm.isDiffMode = newState.name === 'tenant.feed.diff';
            vm.isAverageMode = newState.name === 'tenant.feed.average';
            vm.isSumMode = newState.name === 'tenant.feed.sum';
            vm.isChartMode = newState.name === 'tenant.feed.charts';
            vm.isRatingMode = newState.name === 'tenant.feed.rating.instance';

            vm.selectedItemId = null;
            vm.diffFeeds = null;
            vm.averageFeeds = null;
            vm.sumFeeds = null;
            vm.chartFeeds = null;
            vm.ratingFeeds = null;

            var paramFeeds = params.feeds ?
                params.feeds.split(':') :
                [];

            // update list after switch to diff mode
            if (vm.isDiffMode) {
                vm.selectedItemId = null;
                vm.diffFeeds = paramFeeds;
            } else if (vm.isAverageMode) {
                vm.selectedItemId = null;
                vm.averageFeeds = paramFeeds;
            } else if (vm.isSumMode) {
                vm.selectedItemId = null;
                vm.sumFeeds = paramFeeds;
            } else if (vm.isChartMode) {
                vm.selectedItemId = null;
                vm.chartFeeds = paramFeeds;
            } else if (vm.isRatingMode) {
                vm.selectedItemId = null;
                vm.ratingFeeds = paramFeeds;
            }
            else if (newState.name === 'tenant.feed') {
                vm.selectedItemId = null;
                feedFactory.getFeedDashboard().then(function(dashboard) {
                    vm.dashboard = dashboard;
                });
            } else if (newState.name === 'tenant.feed.instance') {
                vm.selectedItemId = params.feedId;
            }
            
            // update list after delete or add new feed
            if (oldState.name === 'tenant.feed.edit' || 
                oldState.name === 'tenant.feed.new' ||
                newState.name === 'tenant.feed') {
                feedFactory.getFeeds().then(function(result) {
                    vm.feedItems = result.feeds;
                    vm.filterValues = result.filterValues;
                    vm.updateVisible();
                });
            } else {
                vm.updateVisible();
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('PlanningController', PlanningController);

    function PlanningController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateSum(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.sumFeeds(feedsForDiff).then(function (result) {
                vm.properties = result.properties;
                vm.sumsRows = result.sumsRows;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.sum') {
                updateSum(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('RatingController', RatingController);

    function RatingController($scope, feedFactory, $state, $stateParams, _) {

    	var vm = this;
        vm.props = $state.current.data.feedType === 'haylage' ?
            ['Сухое вещество', 'Баланс расщепляемого протеина, OEB', 
            'Переваримость органического вещества, VCOS', 'NH3-фракция', 
            'Сахар', 'Нейтрально-детергентная клетчатка, NDF',
            'Сырой протеин'] :
            ['Сухое вещество', 'Чистая энергия на лактацию, NEL', 
            'Переваримость органического вещества, VCOS',
            'NH3-фракция', 'Крахмал', 'Нейтрально-детергентная клетчатка, NDF'];
        
        vm.feedType = $state.params.feedType;
        var feeds = $stateParams.feeds;

        vm.goToHaylage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'haylage'
            });
        };
        vm.goToSilage = function () {
            $state.go('tenant.feed.rating.instance', {
                feedType: 'silage'
            });
        };

    	function updateRating(feeds) {

    		if (!feeds.length) {
    			vm.feeds = [];
                vm.properties = [];
    			return;
    		}

    		feedFactory.ratingFeeds(feeds, vm.feedType).then(function (result) {
                vm.properties = result.properties;
                vm.feeds = result.feeds;
    		});
    	};	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.rating.instance') {
                updateRating(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('RatingDemoController', RatingDemoController);

    function RatingDemoController($scope, feedFactory, $state, $stateParams, _) {

    	var vm = this;
    	feedFactory.ratingDemoFeeds().then(function (result) {
            vm.properties = result.properties;
            vm.feeds = result.feeds;
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('SumController', SumController);

    function SumController($scope, feedFactory, $stateParams, _) {

    	var vm = this;
        vm._ = _;

        var feeds = $stateParams.feeds;
    	function updateSum(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.sumFeeds(feedsForDiff).then(function (result) {
                vm.properties = result.properties;
                vm.sumsRows = result.sumsRows;
    		});
    	}	

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            if (newState.name === 'tenant.feed.sum') {
                updateSum(_.filter(params.feeds.split(':'), Boolean));
            }
        });
    }
})();
(function() {
    'use strict';
    angular.module('feed').controller('SumDemoController', SumDemoController);

    function SumDemoController(feedFactory, _) {

    	var vm = this;
        vm._ = _;

        feedFactory.sumDemoFeeds().then(function (result) {
            vm.properties = result.properties;
            vm.sumsRows = result.sumsRows;
        });
    }
})();
(function() {
    'use strict';
    FeedViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'feedFactory', '_']
    angular.module('feed').controller('FeedViewController', FeedViewController);

    function FeedViewController($mdDialog, $stateParams, $state, authFactory, feedFactory, _) {
        var vm = this;
        vm._ = _;
        var feedId = $stateParams.feedId;
        if (!feedId) {
            return;
        }
        vm.isDrySwitch = true;
        vm.print = function() {
            
            authFactory.getSessionData().then(function(data) {

                var analysisPrint = document.getElementById('analysis');
                var generalPrint = document.getElementById('general');
                var harvestPrint = document.getElementById('harvest');
                var feedingPrint = document.getElementById('feeding');

                var popupWin = window.open('', '_blank');
                popupWin.document.open();
                popupWin.document.write(
                    '<html style="background-color: #fff;">'+
                        '<title>ПРОКОРМ:печать</title>'+
                        '<head>'+
                            '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                            '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                        '</head>'+
                        '<body onload="setTimeout(function() {window.print(); window.close();}, 500)" class="feed print">' + 
                            (analysisPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + 
                                '</h2><label class="key">анализы:  </label>' + vm.feed.name + '&nbsp;&nbsp;&nbsp;' + vm.feed.year + '&nbsp;&nbsp;&nbsp;' +  vm.feed.storage + '</div>' +
                                '<br/>' +
                                analysisPrint.innerHTML + 
                                '<div class="break"></div>') : ''
                            ) +
                            (generalPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">основные:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                generalPrint.innerHTML + 
                                '<br/>') : ''
                            ) +
                            (harvestPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">заготовка:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                harvestPrint.innerHTML + 
                                '<br/>') : '' 
                            ) +
                            (feedingPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">кормление:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                feedingPrint.innerHTML) : ''
                            ) + 
                        '</body>'+
                        '<footer>prokorm.com</footer>' +
                    '</html>');
                popupWin.document.close();
                //popupWin.onfocus=function(){ popupWin.close();}

            });
        };
        vm.edit = function() {
            $state.go('tenant.feed.edit', {
                'feedId': feedId
            });
        };
        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Удаление')
                .textContent('Вы хотите удалить корм ' + vm.feed.name + ' ?')
                .targetEvent(ev).ok('Да').cancel('Отменить');
            $mdDialog.show(confirm).then(function() {
                feedFactory.deleteFeed($stateParams.feedId).then(function(res) {
                    $state.go('tenant.feed');
                });
            }, function() {});
        };
        feedFactory.getFeedView(feedId).then(function(feedView) {
            vm.feed = feedView.general;
            vm.feedItemSections = feedView.feedItemSections;
            vm.actions = feedView.actions;
        });
    }
})();
(function() {
    'use strict';
    FeedViewDemoController.$inject = ['$stateParams', '$state', 'feedFactory', '_']
    angular.module('feed').controller('FeedViewDemoController', FeedViewDemoController);

    function FeedViewDemoController($stateParams, $state, feedFactory, _) {
        var vm = this;
        vm._ = _;
        vm.isDrySwitch = true;
        vm.print = function() {
            
            authFactory.getSessionData().then(function(data) {

                var analysisPrint = document.getElementById('analysis');
                var generalPrint = document.getElementById('general');
                var harvestPrint = document.getElementById('harvest');
                var feedingPrint = document.getElementById('feeding');

                var popupWin = window.open('', '_blank');
                popupWin.document.open();
                popupWin.document.write(
                    '<html style="background-color: #fff;">'+
                        '<title>ПРОКОРМ:печать</title>'+
                        '<head>'+
                            '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                            '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                        '</head>'+
                        '<body onload="setTimeout(function() {window.print(); window.close();}, 500)" class="feed print">' + 
                            (analysisPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + 
                                '</h2><label class="key">анализы:  </label>' + vm.feed.name + '&nbsp;&nbsp;&nbsp;' + vm.feed.year + '&nbsp;&nbsp;&nbsp;' +  vm.feed.storage + '</div>' +
                                '<br/>' +
                                analysisPrint.innerHTML + 
                                '<div class="break"></div>') : ''
                            ) +
                            (generalPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">основные:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                generalPrint.innerHTML + 
                                '<br/>') : ''
                            ) +
                            (harvestPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">заготовка:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                harvestPrint.innerHTML + 
                                '<br/>') : '' 
                            ) +
                            (feedingPrint ? 
                                ('<div class="print-title"><h2>' + data.user.tenantFullName + '</h2><label class="key">кормление:  </label>' + vm.feed.name + '   ' + vm.feed.year + '</div>' +
                                '<br/>' +
                                feedingPrint.innerHTML) : ''
                            ) + 
                        '</body>'+
                        '<footer>prokorm.com</footer>' +
                    '</html>');
                popupWin.document.close();
                //popupWin.onfocus=function(){ popupWin.close();}

            });
        };
        feedFactory.getFeedViewDemo().then(function(feedView) {
            vm.feed = feedView.general;
            vm.feedItemSections = feedView.feedItemSections;
            vm.actions = feedView.actions;
        });
    }
})();
(function() {
    'use strict';
    angular.module('help').controller('HelpController', HelpController);
    /** @ngInject */
    function HelpController($scope, $state) {
        
    }
})();
(function() {
    'use strict';
    angular.module('help').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.help', {
                url: '/help',
                templateUrl: 'app/help/help.html',
                controller: 'HelpController',
                controllerAs: 'help',
                data: {
                    module: 'help'
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('HomeController', HomeController);
    /** @ngInject */
    function HomeController($scope, $state, authFactory, $mdDialog) {
        var originatorEv;
        var vm = this;
        vm.currentModule = '';
        authFactory.getSessionData().then(function(data) {
            vm.sessionData = data;
        });
        vm.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        vm.goToModule = function(module) {
            $state.go('tenant.' + module);
            //$window.location.href = '#/farm/kamenskoe' + module.url;
        };

        vm.logout = function () {
            authFactory.logout();
        };

        vm.profile = function () {
            $state.go('tenant.profile.view');
        };

        vm.help = function () {
            $state.go('tenant.help');
        }; 

        vm.info = function () {
            $state.go('tenant.info');
        };        

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.currentModule = newState.data && newState.data.module;
        });
    }
})();
(function() {
    'use strict';
    angular.module('info').controller('InfoController', InfoController);
    /** @ngInject */
    function InfoController($scope, $state, version) {
    	var vm = this;
        vm.version = version;
    }
})();
(function() {
    'use strict';
    angular.module('info').config(routerConfig);
    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tenant.info', {
                url: '/info',
                templateUrl: 'app/info/info.html',
                controller: 'InfoController',
                controllerAs: 'info',
                data: {
                    module: 'info'
                }
            });
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('LoginController', LoginController);
    /** @ngInject */
    function LoginController($http, $state, authFactory) {
        var vm = this;

        vm.tenantName = $state.params.tenant;
        vm.user = {
            tenantname: vm.tenantName || '',
            username: '',
            password: ''
        };
        vm.do = function () {
            authFactory.login(vm.user).then(
                function(response) {
                    $state.go('tenant.feed', { 'id': response.tenantName });
                }, function (err) {
                    vm.info = err.message;
                }
            );
        };

        vm.goToRegistration = function () {
            
        };
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('RegistrationController', RegistrationController);
    /** @ngInject */
    function RegistrationController($http, authFactory) {
        var vm = this;
        vm.user = {
            loginname: '',
            email: ''
        };
        vm.do = function () {
            vm.error = '';
            authFactory.registration(vm.user).then(
                function(response) {
                    if (response && response.message) {
                        vm.successMessage = response.message;
                    }
                }, 
                function(err) {
                    vm.error = err.message;
                }
            );
        };

        vm.goToRegistration = function () {
            
        };
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('ProfileViewController', ProfileViewController);
    /** @ngInject */
    function ProfileViewController($scope, $state, $mdDialog, authFactory) {
        var vm = this;
        authFactory.getProfileView().then(function(result) {
            vm.userInfo = result.controls;
            vm.companyUsers = result.companyUsers;
        });
        vm.edit = function() {
            $state.go('tenant.profile.edit');
        };
        vm.changePassword = function(ev) {
            $mdDialog.show({
                controller: ChangePasswordController,
                templateUrl: './app/profile/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            }).then(function(answer) {
                $state.go('tenant.profile.view');
            }, function() {
                $state.go('tenant.profile.view');
            });
        };

        vm.addUser = function () {
            $state.go('tenant.profile.addUser');        
        };
    }
    angular.module('prokorm').controller('ProfileEditController', ProfileEditController);
    /** @ngInject */
    function ProfileEditController($scope, $state, authFactory) {
        var vm = this;
        authFactory.getProfileEdit().then(function(result) {
            vm.userInfo = result.controls;
            vm.profile = result.profile;
        });
        vm.save = function() {
            authFactory.updateProfile(vm.profile).then(function(result) {
                if (result.message === 'OK') {
                    $state.go('tenant.profile.view');
                }
            });
        };
        vm.cancel = function () {
            $state.go('tenant.profile.view');
        };
    }
    angular.module('prokorm').controller('AddUserController', AddUserController);
    /** @ngInject */
    function AddUserController($scope, $state, authFactory) {
        var vm = this;
        vm.user = {
            name: '',
            fullName: '',
            email: '',
            password: '',
            tenantFullName: ''
        };
        vm.cancel = function() {
            $state.go('tenant.profile.view');
        };
        vm.save2 = function() {
            if (vm.user.password === vm.password_2) {
                var permissions = [];
                if (vm.allowRead){
                    permissions.push('read');
                }
                if (vm.allowWrite){
                    permissions.push('write');
                }
                var user = _.extend(vm.user, {
                    permissions: permissions
                });
                authFactory.addUser(user).then(function(result) {
                    if (result.message === 'OK') {
                        $state.go('tenant.profile.view');
                    }
                });
            }
        };
    }
    angular.module('prokorm').controller('ChangePasswordController', ChangePasswordController);
    /** @ngInject */
    function ChangePasswordController($scope, $mdDialog, authFactory) {
        
        $scope.currentPassword = '';
        $scope.newPassword = '';
        $scope.newPassword2 = '';

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function () {
            authFactory.setPassword({
                currentPassword: $scope.currentPassword,
                newPassword: $scope.newPassword,
                newPassword2: $scope.newPassword2
            }).then(function (data) {
                if (data.message === 'OK') {
                    $state.go('tenant.profile.view');
                }
            });
        };
    }
})();
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
(function() {
    'use strict';
    angular.module('profile').controller('ProfileViewController', ProfileViewController);
    /** @ngInject */
    function ProfileViewController($scope, $state, $mdDialog, authFactory) {
        var vm = this;
        authFactory.getProfileView().then(function(result) {
            vm.userInfo = result.controls;
            vm.companyUsers = result.companyUsers;
        });
        vm.edit = function() {
            $state.go('tenant.profile.edit');
        };
        vm.changePassword = function(ev) {
            $mdDialog.show({
                controller: ChangePasswordController,
                templateUrl: './app/profile/changePassword/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            }).then(function(answer) {
                $state.go('tenant.profile.view');
            }, function() {
                $state.go('tenant.profile.view');
            });
        };

        vm.addUser = function () {
            $state.go('tenant.profile.addUser');        
        };
    }
    angular.module('profile').controller('ProfileEditController', ProfileEditController);
    /** @ngInject */
    function ProfileEditController($scope, $state, authFactory) {
        var vm = this;
        authFactory.getProfileEdit().then(function(result) {
            vm.userInfo = result.controls;
            vm.profile = result.profile;
        });
        vm.save = function() {
            authFactory.updateProfile(vm.profile).then(function(result) {
                if (result.message === 'OK') {
                    $state.go('tenant.profile.view');
                }
            });
        };
        vm.cancel = function () {
            $state.go('tenant.profile.view');
        };
    }
    angular.module('profile').controller('AddUserController', AddUserController);
    /** @ngInject */
    function AddUserController($scope, $state, authFactory) {
        var vm = this;
        vm.user = {
            name: '',
            fullName: '',
            email: '',
            password: '',
            tenantFullName: ''
        };
        vm.cancel = function() {
            $state.go('tenant.profile.view');
        };
        vm.save2 = function() {
            if (vm.user.password === vm.password_2) {
                var permissions = [];
                if (vm.allowRead){
                    permissions.push('read');
                }
                if (vm.allowWrite){
                    permissions.push('write');
                }
                var user = _.extend(vm.user, {
                    permissions: permissions
                });
                authFactory.addUser(user).then(function(result) {
                    if (result.message === 'OK') {
                        $state.go('tenant.profile.view');
                    }
                });
            }
        };
    }
    angular.module('profile').controller('ChangePasswordController', ChangePasswordController);
    /** @ngInject */
    function ChangePasswordController($scope, $mdDialog, authFactory) {
        
        $scope.currentPassword = '';
        $scope.newPassword = '';
        $scope.newPassword2 = '';

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.save = function () {
            authFactory.setPassword({
                currentPassword: $scope.currentPassword,
                newPassword: $scope.newPassword,
                newPassword2: $scope.newPassword2
            }).then(function (data) {
                if (data.message === 'OK') {
                    $state.go('tenant.profile.view');
                }
            });
        };
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('PublicController', PublicController);
    function PublicController($state, authFactory) {
        var vm = this;
        $state.go('public.view');
        vm.current = 'view';
        vm.buttons = [{
        	name: 'анализы',
        	key: 'view',
        	url: '/#/view'
        }, {
        	name: 'сравнение',
        	key: 'diff',
        	url: '/#/diff'
        }, {
        	name: 'среднее',
        	key: 'average',
        	url: '/#/average'
        }, {
        	name: 'сумма',
        	key: 'sum',
        	url: '/#/sum'
        }, {
            name: 'рейтинг',
            key: 'rating',
            url: '/#/rating'
        }, {
            name: 'аналитика',
            key: 'charts',
            url: '/#/charts'
        }];
    }
})();
(function() {
    'use strict';
    angular.module('prokorm').controller('SettingsController', SettingsController);
    /** @ngInject */
    function SettingsController($scope, $state) {
        
    }
})();