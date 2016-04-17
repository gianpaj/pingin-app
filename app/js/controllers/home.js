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
              if (stringObj.location == 'parking') {
                $rootScope.filter.step1 = true;
                console.log('step1');
              }
              if (stringObj.location == ' checkin') {
                $rootScope.filter.step2 = true;
                console.log('step2');
              }
              if (stringObj.location == ' security') {
                $rootScope.filter.step3 = true;
                console.log('step3');
              }
              if (stringObj.location == ' shopping') {
                $rootScope.filter.step4 = true;
                console.log('step4');
              }
              if (stringObj.location == ' flight') {
                $rootScope.filter.step5 = true;
                console.log('step5');
              }
              angular.copy(stringObj.location, tag);
              // if necessary $state.go('some-route')
            });

            $ionicPopup.alert({
              title: 'You\'ve arrive to',
              template: stringObj.location + '<br>You\'ve earned 5 points.',
              buttons: [
                { text: 'Great!', type: 'button-positive' }
              ]
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

  HomeController.$inject = ['$scope', '$rootScope', '$ionicPopup', '$http', '$filter', '$location', 'Modals', 'Model', '$ionicPlatform', 'nfcService'];
  function HomeController($scope, $rootScope, $ionicPopup, $http, $filter, $location, Modals, Model, $ionicPlatform, nfcService) {
    $rootScope.filter = {};

    $rootScope.filter.your_filed_departuretime = '00:01';

    $scope.go = function(filed_departuretime) {
      $location.path( '/tab/rewards' );
      $rootScope.filter.your_filed_departuretime = filed_departuretime;
      console.log($rootScope.filter.your_filed_departuretime);
    };

    var format = 'HH:mm';

    var cleanFlights = function (data) {

      var cleanData = [];

      data.forEach(function(item) {
        item.filed_departuretime = $filter('date')(item.filed_departuretime*1000, format);
        var flightLetters = item.flightnumber.substr(0,3);
        if (flightLetters == 'RYR') {
          item.airline = 'Ryanair';
          item.airlineLogo = 'img/ryanair.png';
        }
        else if (flightLetters == 'EIN') {
          item.airline = 'Aer Lingus';
          item.airlineLogo = 'img/aerlingus.png';
        }
        else if (flightLetters == 'LHA') {
          item.airline = 'Lufthansa';
          item.airlineLogo = 'img/lufthansa.png';
        }
        else {
          return;
        }
        // else if (flightLetters == 'BEE') {
        //   item.airline = 'Flybe';
        // }
        // else if (flightLetters == 'BCY') {
        //   item.airline = 'CityJet';
        // }
        // else if (flightLetters == 'VLG') {
        //   item.airline = 'Vueling';
        // }
        // else if (flightLetters == 'BAW') {
        //   item.airline = 'British Airways';
        // }
        cleanData.push(item);
      });

      return cleanData;
    };

    $http({
      method: 'GET',
      url: 'http://pinging.cfapps.io/flightapi'
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is available
      // console.log(response);

      $scope.items = cleanFlights(response.data);

    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.error(response);

      /* eslint-disable */
      var data = [{
        'filed_departuretime': 1460893200,
        'destinationName': 'Jersey',
        'flightnumber': 'EIN3342',
        'estimatedarrivaltime': 1460896800
        }, {
        'filed_departuretime': 1460893500,
        'destinationName': 'Inverness',
        'flightnumber': 'LVG6964',
        'estimatedarrivaltime': 1460897820
        }, {
        'filed_departuretime': 1460895000,
        'destinationName': 'Edinburgh',
        'flightnumber': 'EIN3254',
        'estimatedarrivaltime': 1460898900
        }, {
        'filed_departuretime': 1460895300,
        'destinationName': 'Donegal',
        'flightnumber': 'EIN3402',
        'estimatedarrivaltime': 1460898060
        }, {
        'filed_departuretime': 1460896200,
        'destinationName': 'Aberdeen',
        'flightnumber': 'EIN3240',
        'estimatedarrivaltime': 1460900880
        }, {
        'filed_departuretime': 1460898000,
        'destinationName': 'Bristol Int',
        'flightnumber': 'EIN3282',
        'estimatedarrivaltime': 1460901600
        }, {
        'filed_departuretime': 1460899500,
        'destinationName': 'Southampton',
        'flightnumber': 'BEE386',
        'estimatedarrivaltime': 1460903700
        }, {
        'filed_departuretime': 1460899800,
        'destinationName': 'Tenerife South (Reina Sofia)',
        'flightnumber': 'RYR7122',
        'estimatedarrivaltime': 1460915400
        }, {
        'filed_departuretime': 1460900100,
        'destinationName': 'Edinburgh',
        'flightnumber': 'EIN3256',
        'estimatedarrivaltime': 1460904000
        }, {
        'filed_departuretime': 1460900400,
        'destinationName': 'Tenerife South (Reina Sofia)',
        'flightnumber': 'EIN764',
        'estimatedarrivaltime': 1460915700
        }, {
        'filed_departuretime': 1460900400,
        'destinationName': 'London Heathrow',
        'flightnumber': 'EIN168',
        'estimatedarrivaltime': 1460904300
        }, {
        'filed_departuretime': 1460900700,
        'destinationName': 'Bristol Int',
        'flightnumber': 'RYR506',
        'estimatedarrivaltime': 1460904000
        }, {
        'filed_departuretime': 1460900700,
        'destinationName': 'Charles de Gaulle/Roissy',
        'flightnumber': 'BCY1817',
        'estimatedarrivaltime': 1460907000
        }, {
        'filed_departuretime': 1460900700,
        'destinationName': 'Bristol Int',
        'flightnumber': 'RYR506',
        'estimatedarrivaltime': 1460904000
        }, {
        'filed_departuretime': 1460901000,
        'destinationName': 'Liverpool John Lennon',
        'flightnumber': 'RYR1442',
        'estimatedarrivaltime': 1460903750
      }];
      /* eslint-enable */

      $scope.items = cleanFlights(data);
    });

    $scope.points = 10;

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