app.controller('UserIndexCtrl', ['$scope', 'Staff', 'RoleMapping', '$modal', 'toaster',
  function($scope, Staff, RoleMapping, $modal, toaster) {

    // index
    Staff.find(
      {filter:{where: {sysAccount: false}}},
      function (result) {
        $scope.users = result;
        $scope.displayUsers = [].concat($scope.users);
      }
    );


    //remove
    $scope.remove = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/user/modal.delete.html',
        controller: 'UserModalInstanceCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        RoleMapping.find({
          filter: {
            where: {
              and: [{principalId: row.id}, {principalType: 'USER'}]
            },
            limit: 1
          }
        }, function (results) { // no destroy all TODO: create REST endpoint
          angular.forEach(results, function (rm) {
            RoleMapping.deleteById({id: rm.id});
          });
        });
        Staff.deleteById(
          { id: row.id },
          function () {

            var index = $scope.users.indexOf(row);
            if (index !== -1) {
              $scope.users.splice(index, 1);
              toaster.pop('success', '', 'User deleted successfully');
            }
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete user! User is still used in transactions');
          }
        );
      });
    };

  }]);


app.controller('UserNewCtrl', ['$scope', 'Staff', 'Role', 'RoleMapping', '$modal', 'toaster', '$state',
  function($scope, Staff, Role, RoleMapping, $modal, toaster, $state) {

    // init
    $scope.user = new Staff();
    $scope.user.sysAccount = false; // tidak dapat create system account dari interface ini
    $scope.user.active = true;

    // user groups
    Role.find(
      {filter: {where: {name: {neq: 'System'}}}},
      function (roles) {
        $scope.roleOptions = roles;
      }
    );

    $scope.addUser = function () {

      Staff.create(
        {},
        $scope.user,
        function (user) {
          if ($scope.user.role) {
            RoleMapping.create(
              {},
              {
                principalType: 'USER',
                principalId: user.id,
                roleId: $scope.user.role
              },
              function() {
                toaster.pop('success', '', 'User added successfully');
                $state.go('setting.user.list');
              },
              function () {
                toaster.pop('warning', '', 'User added but failed to assign role');
                $state.go('setting.user.list');
              }
            );
          } else {
            toaster.pop('warning', '', 'User added successfully without role');
            $state.go('setting.user.list');
          }
        },
        function (error) {
          toaster.pop('error', '', 'Failed to add a user! ('+error.detail+')');
        }
      );

    };



  }]);


app.controller('UserEditCtrl', ['$scope', 'Staff', 'Role', 'RoleMapping', '$modal', 'toaster', '$state', '$stateParams',
  function($scope, Staff, Role, RoleMapping, $modal, toaster, $state, $stateParams) {

    // init
    $scope.user = {};
    // user groups
    Role.find(
      {filter: {where: {name: {neq: 'System'}}}},
      function (roles) {
        $scope.roleOptions = roles;
      }
    );

    Staff.findById({id: $stateParams.id}, function (user) {
      $scope.user = user;
      // selected group
      RoleMapping.find({
        filter: {
          where: {
            and: [{principalType: 'USER'}, {principalId: user.id}]
          },
          limit: 1
        }
      }, function (rm) {
        if (rm.length)
          $scope.user.role = rm[0].roleId;
        else
          $scope.user.role = null;
      });
    });

    $scope.updateUser = function () {

      Staff.update(
        {where: {id: $stateParams.id}},
        $scope.user,
        function (user) {
          if ($scope.user.role) {
            RoleMapping.find({
                filter: {
                  where: {
                    and: [{principalId: user.id}, {principalType: 'USER'}]
                  },
                  limit: 1
                }
              },
              function (rm) {
                if (rm.length) {
                  RoleMapping.update({
                      where: {
                        and: [{principalId: user.id}, {principalType: 'USER'}]
                      }
                    },
                    {roleId: $scope.user.role},
                    function() {
                      toaster.pop('success', '', 'User updated successfully');
                      $state.go('setting.user.list');
                    },
                    function () {
                      toaster.pop('warning', '', 'User update but failed to update group');
                      $state.go('setting.user.list');
                    }
                  );
                } else {
                  RoleMapping.create(
                    {},
                    {
                      principalType: 'USER',
                      principalId: user.id,
                      roleId: $scope.user.role
                    },
                    function() {
                      toaster.pop('success', '', 'User updated successfully');
                      $state.go('setting.user.list');
                    },
                    function () {
                      toaster.pop('warning', '', 'User updated but failed to assign group');
                      $state.go('setting.user.list');
                    }
                  );
                }

              });
          }
        },
        function (error) {
          toaster.pop('error', '', 'Failed to update user!');
        }
      );

    };

  }]);

// TODO: Test this password update controller
app.controller('UserPasswdCtrl', ['$scope', 'Staff', 'toaster', '$state', '$stateParams',
  function($scope, Staff, toaster, $state, $stateParams) {

    // init
    $scope.user = {};
    Staff.findById({id: $stateParams.id}, function (user) {
      $scope.user = user;
    });

    $scope.updatePassword = function () {
      //
      //Staff.updatePassword(
      //  {},
      //  {id: $stateParams.id, password: $scope.user.newPassword},
      //  function() {
      //    toaster.pop('success', '', 'Password updated successfully');
      //    $state.go('app.setting.user');
      //  },
      //  function () {
      //    toaster.pop('error', '', 'Failed to update password');
      //  }
      //);
      //
      Staff.update(
        {where: {id: $stateParams.id}},
        {password: $scope.user.newPassword},
        function() {
          toaster.pop('success', '', 'Password updated successfully');
          $state.go('setting.user.list');
        },
        function (error) {
          toaster.pop('error', '', 'Failed to update password');
        }
      );

      //console.log($scope.user);
      //$scope.user.hasPassword($scope.user.current_password, function (err, isMatch) {
      //  if (err) return err;
      //  else {
      //    console.log($scope.user);
      //  }
      //});

    }

  }]);

app.controller('UserModalInstanceCtrl', ['$scope', '$modalInstance', 'item',
  function($scope, $modalInstance, item) {
    $scope.item = item;

    $scope.ok = function () {
      $modalInstance.close($scope.id);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
