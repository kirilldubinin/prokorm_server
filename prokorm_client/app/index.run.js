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
