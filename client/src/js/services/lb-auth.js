angular.module('lbAuth', [])
  .factory('AuthService', ['Staff', 'RoleMapping', '$q', '$rootScope', '$localStorage',
    function(Staff, RoleMapping, $q, $rootScope, $localStorage) {

      function login(email, password) {
        return Staff
          .login({email: email, password: password})
          .$promise
          .then(function(response) {
            $rootScope.currentUser = {
              id: response.user.id,
              tokenId: response.id,
              email: email,
              name: response.user.name
            };
            $localStorage.user = $rootScope.currentUser;
            $localStorage.property = { id: null, name: 'Please Set Property Scope'};
            $rootScope.isLoggedIn = true;
          });
      }

      function logout() {
        return Staff
          .logout()
          .$promise
          .then(function() {
            $rootScope.currentUser = null;
            delete $localStorage.user;
            delete $localStorage.property;
          });
      }

      function register(email, password) {
        return Staff
          .create({
            email: email,
            password: password
          })
          .$promise;
      }

      function isLoggedIn() {
        return Staff.isAuthenticated();
      }

      function getCurrentUser() {
        return Staff.getCurrent().$promise.then(function (user) {
          $rootScope.currentUser = {
            id: user.id,
            email: user.email,
            name: user.name
          };
          //Staff.myRole(function(result) {
          //  $rootScope.currentUser.role = result.role
          //});
        });
      }

      function isAllowed(model, method) {
        var modelId = '*';

        return Staff.isAllowed({
          model: model,
          modelId: modelId,
          method: method
        });
      }

      return {
        login: login,
        logout: logout,
        register: register,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser,
        isAllowed: isAllowed
      };
    }]);
