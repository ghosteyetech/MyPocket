'use strict';
myPocket.service('myPocketDataService', ['$http', function ($http) {
	return{		
		get_ajax: function(url,data, headers, handleSuccess, handleError) {
             //return the promise directly.
             var request = $http({
                        method: "get",
                        url: url,
                        params: data,
                        headers: {
                            "Accept": "application/json;charset=utf-8"
                        }
                    });
                    return( request.then( handleSuccess, handleError ) )
        },
		post_ajax: function(url,data, handleSuccess, handleError) {
			return $http.post(url, data).then(handleSuccess, handleError);
		},
		put_ajax: function(url,data,handleSuccess, handleError){
			return $http.put(url,
							data
						 )
                       .then( handleSuccess, handleError);
		},
		
		delete_ajax: function(url, handleSuccess, handleError) {
			return $http.delete(url).then(handleSuccess, handleError);
		}
	};
}]);