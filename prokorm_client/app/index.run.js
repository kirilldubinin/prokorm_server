(function() {
  'use strict';

  angular
    .module('prokorm')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
