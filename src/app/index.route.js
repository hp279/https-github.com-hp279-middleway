(function () {
  'use strict';

  angular
    .module('middleway')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'app/navbar/body.html',
        controller: 'NavBarController',
        controllerAs: 'ctrl'
      })
      .state('app.home', {
        url: '/',
        views: {
          'main': {
            templateUrl: 'app/main/body.html',
            controller: 'MainController',
            controllerAs: 'ctrl'
          }
        }
      })
      .state('app.map', {
        url: '/map',
        views: {
          'main': {
            templateUrl: 'app/map/body.html',
            controller: 'MapController',
            controllerAs: 'ctrl'
          }
        }
      });


    $urlRouterProvider.otherwise('/');
  }

})();
