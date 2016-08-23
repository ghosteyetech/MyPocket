myPocket.service('sharedPrefService', function($cordovaPreferences){

	$scope.store = function() {
    $cordovaPreferences.store('key', 'myMagicValue')
      .success(function(value) {
        alert("Success: " + value);
      })
      .error(function(error) {
        alert("Error: " + error);
      })
  };

  $scope.fetch = function() {
    $cordovaPreferences.fetch('key')
      .success(function(value) {
        alert("Success: " + value);
      })
      .error(function(error) {
        alert("Error: " + error);
      })
  };

  $scope.remove = function() {
    $cordovaPreferences.remove('key')
      .success(function(value) {
        alert("Success: " + value);
      })
      .error(function(error) {
        alert("Error: " + error);
      })
  };

  $scope.show = function() {
    $cordovaPreferences.show()
      .success(function(value) {
        alert("Success: " + value);
      })
      .error(function(error) {
        alert("Error: " + error);
      })
  };

  return{
  	
  }
});