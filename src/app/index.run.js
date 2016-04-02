(function() {
  'use strict';

  angular
    .module('middleway')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
