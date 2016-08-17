//angular.module('mypocket.controllers', [])
myPocket
.controller('loginCtrl', function($scope,$state,$stateParams,$ionicPopup,loginService){

  $scope.data = {
    username : null,
    password : null

  };

  $scope.login = function(){

    console.log("Loging data :");
    console.log($scope.data);

    loginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
    });
    //$state.go('tab.dash', {listId: $stateParams.listId, itemId: $stateParams.itemId});
    


  };

})

.controller('DashCtrl', function($scope,$ionicPopup) {

  $scope.showPrompt = function() {
  
      $scope.data = {};

      var promptPopup = $ionicPopup.prompt({
         title: 'New Expense',
         template: '<div class="list">'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label" >First Name</span>'
                      +'<input type="text" placeholder="First Name" ng-model="data.fName">'
                    +'</label>'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label">Last Name</span>'
                      +'<input type="text" placeholder="Last Name" ng-model="data.lName">'
                    +'</label>'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label">Email</span>'
                      +'<input type="text" placeholder="Email" ng-model="data.email">'
                    +'</label>'
                  +'</div>',        
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.fName) {
                console.log($scope.data);
                console.log("Plaese enter name");
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                console.log("Data found");
                return $scope.data;
              }
            }
          }
        ]        
         
      });
        
      promptPopup.then(function(res) {
         console.log("Data from popup :");
         console.log(res);
      });
    
   };

})

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
