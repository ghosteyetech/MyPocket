//angular.module('mypocket.controllers', [])
myPocket
.controller('AppCtrl', function($rootScope,$scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };

  //====
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
 
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
  //====
})

.controller('loginCtrl', function($scope,$state,$stateParams,$ionicPopup,loginService,AuthService){

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
    


  

})

.controller('DashCtrl', function($scope,$ionicPopup,$state,$http,AuthService,myPocketDataService,ApiEndpoint) {



  $scope.items = [ 
          {id:'1', name:'Expense - 01', price:'5000'},
          {id:'2', name:'Expense - 02', price:'5000'}
          
  ];

  $scope.responseServer = "Nothing";

  $scope.getData = function(){
    //var url = ApiEndpoint.url;
    var url = ApiEndpoint.urlServer+"web";//Solved this problem using "Allow-Control-Allow-Origin: *" chrome extention
    console.log("URL :"+url);
    var data = "";
    console.log("Getting server data");
    myPocketDataService.get_ajax(url,data, {}, function (successObj){
      console.log(successObj);
      $scope.responseServer = successObj.data; 
    }, function (errorObj){
      console.log(errorObj);
      $scope.responseServer = errorObj.data;
    });

    
  };

  $scope.showPrompt = function() {

      $scope.data = {};

      var promptPopup = $ionicPopup.prompt({
         title: 'New Expense',
         template: '<div class="list">'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label" >Expense ID</span>'
                      +'<input type="text" placeholder="Expense ID" ng-model="data.id">'
                    +'</label>'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label" >Expense Name</span>'
                      +'<input type="text" placeholder="Expense Name" ng-model="data.name">'
                    +'</label>'
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label">Price</span>'
                      +'<input type="text" placeholder="Price" ng-model="data.price">'
                    +'</label>'                    
                  +'</div>',        
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.name) {
                console.log($scope.data);                
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
         $scope.items.push(res);
      });
    
   };

   //==========
   $scope.logout = function() {
      AuthService.logout();
      $state.go('login');
   };
   
   $scope.performValidRequest = function() {
      $http.get('http://localhost:8100/valid').then(
        function(result) {
          $scope.response = result;
        });
   };
   
   $scope.performUnauthorizedRequest = function() {
      $http.get('http://localhost:8100/notauthorized').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
   };
   
   $scope.performInvalidRequest = function() {
      $http.get('http://localhost:8100/notauthenticated').then(
        function(result) {
          // No result here..
        }, function(err) {
          $scope.response = err;
        });
   };
   //==========

})


.controller('DashDetailCtrl', function($scope, $stateParams, Chats,$cordovaCamera, $cordovaFile) {
    console.log($stateParams);
    $scope.chat = Chats.get($stateParams.dashId);

    $scope.currentid = 8;

    $scope.allImages = [{id:"1", name:"AA", imgSrc:"img/vegi/a.png"},
                    {id:"2", name:"BB", imgSrc:"img/vegi/b.png"},
                    {id:"3", name:"CC", imgSrc:"img/vegi/c.png"},
                    {id:"4", name:"DD", imgSrc:"img/vegi/d.png"},
                    {id:"addNewItem", name:"HH", imgSrc:"img/addNew.png"}
    ];

    $scope.showImages = function(index){
      console.log("Image index :"+index);
      if( $scope.allImages[index].id == "addNewItem"){
        $scope.addImage();
      }else{
        console.log("Loding popup");
      }
    };

    //=================Adding image start
  //$scope.images = [];  
  
  /*$scope.addImage = function(){
    console.log($scope.allImages);
    var pos = $scope.allImages.length-1;
    var addNewImageObj = $scope.allImages[pos];
    $scope.allImages.splice(pos, 1);//Remove add new image from last

    var urlImage = "img/vegi/a.png"
    //Adding new image and add new image at last
    var takenimage = {id:$scope.currentid, name:"entry.nativeURL", imgSrc:urlImage};    
    $scope.allImages.push(takenimage);
    $scope.allImages.push(addNewImageObj);
  };*/
 
  $scope.addImage = function() {
      console.log("add image");
      var options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
    };
    
    // 3
    $cordovaCamera.getPicture(options).then(function(imageData) {
   
      // 4
      onImageSuccess(imageData);
   
      function onImageSuccess(fileURI) {
        createFileEntry(fileURI);
      }
   
      function createFileEntry(fileURI) {
        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
      }
   
      // 5
      function copyFile(fileEntry) {
        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
        var newName = makeid() + name;
   
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
          fileEntry.copyTo(
            fileSystem2,
            newName,
            onCopySuccess,
            fail
          );
        },
        fail);
      }
      
      // 6
      function onCopySuccess(entry) {
        $scope.$apply(function () {

          $scope.currentid = $scope.currentid +1;          

          //Get correct UrL
          var urlImage = $scope.urlForImage(entry.nativeURL);
          var takenimage = {id:$scope.currentid, name:urlImage, imgSrc:urlImage};
                    
          var pos = $scope.allImages.length-1;
          var addNewImageObj = $scope.allImages[pos];
          $scope.allImages.splice(pos, 1);//Remove add new image from last
          
          //Adding new image and add new image at last          
          $scope.allImages.push(takenimage);
          $scope.allImages.push(addNewImageObj);

          //$scope.images.push(entry.nativeURL);
        });
      }
   
      function fail(error) {
        console.log("fail: " + error.code);
      }
   
      function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   
        for (var i=0; i < 5; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }
   
    }, function(err) {
      console.log(err);
    });
  }

  $scope.urlForImage = function(imageName) {
      console.log("get correct path for image");
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      return trueOrigin;
  }
  //=================Adding image end

    //==================
    $scope.stockList = [];
      var chunkSize = 10;
      var currentIndex = 0;
      var todayDate = new Date();
      $scope.loadMoreRecords = function() {
          // Mocking stock values 
          // In an real application, data would be retrieved from an
          // external system
          
          var stock;
          var i = 0;
          while (i < chunkSize) {
              currentIndex++;
              var newDate = new Date();
              newDate.setDate(todayDate.getDate() - currentIndex);
              if (newDate.getDay() >= 1 && newDate.getDay() <= 5) {
                  stock = {
                      dateValue: newDate,
                      price: 20.0 + Math.random() * 10
                  };
                  $scope.stockList.push(stock);
                  i++;
              }
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
      };

    $scope.loadMoreRecords();

    $scope.loadMore = function() {
      /*$http.get('/more-items').success(function(items) {
        useItems(items);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });*/
      $scope.loadMoreRecords();//ghost
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
    });
    //==================

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
