myPocket.controller('DashCtrl', function($scope,$ionicPopup,$state,$http, $cordovaPreferences, $cordovaSQLite, AuthService,myPocketDataService,ApiEndpoint) {

  //==============================Shared preferences
  var db = null;

  $scope.store = function() {
    /**/
    //=============
    var newMessage = "hihihi ascbsca";

    
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)');

    $cordovaSQLite.execute(db, 'INSERT INTO Messages (message) VALUES (?)', [newMessage])
        .then(function(result) {
            $scope.responseServer = "Message saved successful, cheers!";
    }, function(error) {
            $scope.responseServer = "Error on saving: " + error.message;
    })

    //=============
  };

  $scope.show = function() {
    $cordovaSQLite.execute(db, 'SELECT * FROM Messages ORDER BY id DESC')
      .then(
        function(result) {
            if (result.rows.length > 0) {

                var newMessage = result.rows.item(0).message;
                $scope.responseServer = "Message loaded successful, cheers!"+newMessage;
            }
        },
        function(error) {
            $scope.responseServer = "Error on loading: " + error.message;
        }
    );

  };

  $scope.fetch = function() {
    db = $cordovaSQLite.openDB({name:"nextflow.db", location:'default'});
  };

  $scope.remove = function() {
    db.close(successcb, errorcb);
    function successcb(success){
      $scope.responseServer = success;
    }

    function errorcb(err){
      $scope.responseServer = err;
    }
  };  
  //==============================Shared preferences end


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

});

