// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ngCordova', 'ngAnimate', 'nfcFilters'])

.run(['$ionicPlatform', '$sqliteService',function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      window.StatusBar.styleDefault();
    }

    //Load the Pre-populated database, debug = true
    // $sqliteService.preloadDataBase(true);
  });
}])
.config(['$stateProvider','$urlRouterProvider', '$ionicConfigProvider','$compileProvider',
  function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
    $compileProvider.aHrefSanitizationWhitelist (/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);

    if (ionic.Platform.isIOS()) {
      $ionicConfigProvider.scrolling.jsScrolling(true);
    }

    $stateProvider
      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
          }
        }
      })
      .state('tab.searchFlight', {
        url: '/searchFlight',
        views: {
          'tab-searchFlight': {
            templateUrl: 'templates/searchFlight.html',
            controller: 'HomeController'
          }
        }
      })
      .state('tab.rewards', {
        url: '/rewards',
        views: {
          'tab-rewards': {
            templateUrl: 'templates/rewards.html',
            controller: 'HomeController'
          }
        }
      });
    // $urlRouterProvider.otherwise(function ($injector) {
    //   // $location (parameter)
    //   var $state = $injector.get('$state');
    //   $state.go('home');
    // });
    $urlRouterProvider.otherwise('/tab/home');
  }]);