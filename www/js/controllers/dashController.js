myPocket.controller('DashCtrl', function($scope,$ionicPopup,$state,$http, $cordovaPreferences, $cordovaSQLite, mypocketConfigs, mypocketData,AuthService,myPocketDataService,ApiEndpoint) {

  //==============================SQLite Start
  var db = null;


  $scope.fetch = function() {
    db = $cordovaSQLite.openDB({name:"nextflow.db", location:'default'});
  };

  $scope.store = function() {
    
    var newMessage = "hihihi ascbsca";

    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT)');

    $cordovaSQLite.execute(db, 'INSERT INTO Messages (message) VALUES (?)', [newMessage])
        .then(function(result) {
            $scope.responseServer = "Message saved successful, cheers!";
    }, function(error) {
            $scope.responseServer = "Error on saving: " + error.message;
    })

  };

  $scope.show = function() {
    $cordovaSQLite.execute(db, 'SELECT * FROM Messages ORDER BY id DESC')
      .then(
        function(result) {
            var i,len = result.rows.length;
            $scope.responseServer = "Data : ";              
            for(i=0; i<len; i++){
                var newMessage = result.rows.item(i).message;
                $scope.responseServer = $scope.responseServer + "\n" + newMessage;              
            }

        },
        function(error) {
            $scope.responseServer = "Error on loading: " + error.message;
        }
    );

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
  //==============================SQLite end


  

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

  $scope.items = [ 
          {id:'1', name:'Expense - 01', price:'5000'},
          {id:'2', name:'Expense - 02', price:'5000'}
          
  ];

  $scope.createInstance = function(){
      var data = {        
        name : mypocketData.instance.name,
        createdBy : mypocketData.user.userEmail,       
        password : mypocketData.user.userPass
      };

      var url = mypocketConfigs.urlServer+"/createInstance";//Solved this problem using "Allow-Control-Allow-Origin: *" chrome extention
      console.log("URL :"+url);
      
      console.log("Sending data to the server");
      myPocketDataService.post_ajax(url,data, function (successObj){
        console.log(successObj);
        $scope.responseServer = successObj.data.instanceId; 
        mypocketData.instance.id = successObj.data.instanceId; 

      }, function (errorObj){
        console.log(errorObj);
        $scope.responseServer = errorObj.data;
      });
  };

  $scope.AddnewExpense = function() {

      $scope.data = {};

      var promptPopup = $ionicPopup.prompt({
         title: 'New Expense',
         template: '<div class="list">'                    
                    +'<label class="item item-input item-floating-label">'
                      +'<span class="input-label" >Expense Name</span>'
                      +'<input type="text" placeholder="Expense Name" ng-model="data.name">'
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
        
      promptPopup.then(function(expense) {
         console.log("Data from popup :");
         console.log(expense);
         var item = {id:'1', name:expense.name, price:'0'};

         if(expense != null){
            $scope.items.push(item);

            //===Send new expense to the server
            console.log("User NAme: "+mypocketData.user.userEmail);            

            var data = {
              user : mypocketData.user.userEmail,
              expenseName : expense.name
            };

            var url = mypocketConfigs.urlServer+"/expense";//Solved this problem using "Allow-Control-Allow-Origin: *" chrome extention
            console.log("URL :"+url);
            
            console.log("Sending data to the server");
            myPocketDataService.post_ajax(url,data, function (successObj){
              console.log(successObj);
              $scope.responseServer = successObj.data; 
            }, function (errorObj){
              console.log(errorObj);
              $scope.responseServer = errorObj.data;
            });

            //================================

         }
         
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

