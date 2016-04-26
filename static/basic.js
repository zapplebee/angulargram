var app = angular.module('angulargram',[]);

app.directive('angulargram', function($http) {
  return {
    
    restrict: "C",
    template: '<img ng-repeat="post in instagram track by $index" src="{{post.images.low_resolution.url}}">', //this is an example. you can access anything in the instagram feed, except pagination since it reveals the access key.
    link(scope){
      
      var qty = 64;
      
      $http({
        method: 'GET',
        url: '/instagram.json?qty=' + qty
      }).then(function successCallback(response) {
                scope.instagram = response.data;
              }, function errorCallback(response) {
                scope.error = response;
              });
    }
  }
});