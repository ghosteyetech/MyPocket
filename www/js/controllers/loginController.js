myPocket.controller('loginCtrl', function($scope,$state,$stateParams,$ionicPopup,loginService,AuthService){

  $scope.data = {};
 
  $scope.login = function(data) {
    AuthService.login(data.username, data.password).then(function(authenticated) {
      $state.go('tab.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
    //$state.go('tab.dash', {listId: $stateParams.listId, itemId: $stateParams.itemId});
    


  

});