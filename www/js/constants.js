//angular.module('mypocket')
myPocket
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})

.constant('ApiEndpoint', {
  urlServer : 'https://2-dot-prefab-berm-135123.appspot.com/',	
  url: 'http://localhost:8100/web'
});