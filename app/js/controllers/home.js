/* global nfc */

(function () {
  'use strict';

  angular
    .module('App')
    .factory('nfcService', function($rootScope, $ionicPlatform, $ionicPopup) {

      var tag = {};

      $ionicPlatform.ready(function() {

        if (!ionic.Platform.is('browser')) {

          // Read NDEF formatted NFC Tags
          nfc.addNdefListener (function (nfcEvent) {
            var tag = nfcEvent.tag,
              ndefMessage = tag.ndefMessage;

            // dump the raw json of the message
            // note: real code will need to decode
            // the payload from each record
            console.log(JSON.stringify(ndefMessage));

            // assuming the first record in the message has
            // a payload that can be converted to a string.
            var stringObj = JSON.parse(nfc.bytesToString(ndefMessage[0].payload).substring(3));
            console.log(stringObj);

            $rootScope.$apply(function() {
              angular.copy(stringObj.name, tag);
              // if necessary $state.go('some-route')
            });

            $ionicPopup.alert({
              title: 'Hello World temp',
              template: stringObj.name
            });
          },
          function () { // success callback
            console.log('Waiting for NDEF tag');
          },
          function (error) { // error callback
            console.log('Error adding NDEF listener ' + JSON.stringify(error));
          });

        }
      });

      return {
        tag: tag,

        clearTag: function () {
          angular.copy({}, this.tag);
        }
      };
    })
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$ionicPopup', 'Modals', 'Model', '$ionicPlatform', 'nfcService'];
  function HomeController($scope, $ionicPopup, Modals, Model, $ionicPlatform, nfcService) {

    $scope.users = [];

    $scope.tag = nfcService.tag;

    $scope.HelloWorld = function () {

      $ionicPopup.alert({
        title: 'Hello World temp',
        template: 'This is the best template to start with Ionic Framework!'
        // cssClass: 'animated bounceInDown'
      });
    };

    $scope.showUsers = function () {
      Model.Users.getAll().then(function (users) {
        $scope.users = angular.copy(users);
      });
      Modals.openModal($scope, 'templates/modals/users.html', 'animated rotateInDownLeft');
    };

    $scope.closeModal = function () {
      Modals.closeModal();
      $scope.users = [];
    };
  }
})();