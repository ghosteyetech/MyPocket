myPocket.controller('DashDetailCtrl', function($scope, $stateParams, $rootScope, $cordovaCamera, $cordovaFile, $ionicPopup) {
    console.log($stateParams);
    
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
  
  $scope.addImage = function(){
    console.log($scope.allImages);
    var pos = $scope.allImages.length-1;
    var addNewImageObj = $scope.allImages[pos];
    $scope.allImages.splice(pos, 1);//Remove add new image from last

    var urlImage = "img/vegi/a.png"
    //Adding new image and add new image at last
    var takenimage = {id:$scope.currentid, name:"entry.nativeURL", imgSrc:urlImage};    
    $scope.allImages.push(takenimage);
    $scope.allImages.push(addNewImageObj);

    $rootScope.$broadcast("new-image-added", {data:takenimage});

  };

  $rootScope.$on("new-image-added", function(event,args) {
    console.log("Data :");
    console.log(args.data);
    var alertPopup = $ionicPopup.alert({
      title: 'Got!',
      template: 'Image-selected'
    });
  });
 
  $scope.addImagee = function() {
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

});