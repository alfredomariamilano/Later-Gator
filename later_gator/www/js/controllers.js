angular.module('starter.controllers', [])

.controller('DestinationsCtrl', function($http){
  var vm = this;
  vm.showInfo= function() {
    // $(".hiddenDiv").show();
    $(".hiddenDiv").toggleClass("showing");
    $(".arrows").toggleClass("rotate");
  };

  $http({ method:'GET',
          url:   'https://nomadlist.com/api/v2/list/cities'
  }).then(function(res){
    vm.destinations = res.data.result;
    console.log(vm.destinations);
    for (var i = 300; i < vm.destinations.length; i++) {
      vm.destinations.pop();
      i--;
    }
    vm.randomize();
    $("i").hide();
    $(".clickarea").fadeIn(1000);
  }, function(res){
    console.log(res);
  });

  vm.randomize = function(){
    vm.random = {};
    $(".image-here").hide();
    vm.random = Math.floor(Math.random() * (vm.destinations.length -1));
    vm.randomDestination = vm.destinations[vm.random];
    $http({ method:'GET',
            url:   `https://nomadlist.com/api/v2/list/cities/${vm.randomDestination}`
    }).then(function(res){
              // console.log(res.data.result)
      vm.destination = {
        image : res.data.result[0].media.image['500'],
        city_name : res.data.result[0].info.city.name,
        country_name : res.data.result[0].info.country.name,
        hotel_cost : Math.round(res.data.result[0].cost.hotel.USD * vm.rate * 100)/100,
        airbnb_cost : Math.round(res.data.result[0].cost.airbnb_median.USD * vm.rate * 100)/100,
        coffee_cost : Math.round(res.data.result[0].cost.coffee_in_cafe.USD * vm.rate * 100)/100,
        beer_cost : Math.round(res.data.result[0].cost.beer_in_cafe.USD * vm.rate * 100)/100,
        nightlife_score : new Array(res.data.result[0].scores.nightlife*5)
      };
      $(".image-container").addClass("loaded");
      $(".image-here").fadeIn(1400);
    });
  };
  $http({ method:'GET',
          url:   'http://api.fixer.io/latest?base=USD&symbols=GBP'
  }).then(function(res) {
      vm.rate = res.data.rates.GBP;
  });
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
