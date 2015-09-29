app.controller('ConfigPropertyCtrl', ['$scope', 'Company', 'Property', 'CompanyPropertyRel', '$modal', 'toaster',
  function($scope, Company, Property, CompanyPropertyRel, $modal, toaster) {

    // variables
    $scope.showProperties = false;

    // index TODO: Filter from related model
    Company.find(
      {filter: {
        include: {
          relation: 'companyRoles',
          scope: {
            //where: { or: [{companyAs: 'Management'}, {companyAs: ''}, {companyAs: null}]}
          }
        }
      }},
      function (result) {
        //console.log(result);
        //$scope.managements = result;
        //$scope.displayManagements = [].concat($scope.managements);
        $scope.managements = [];
        $scope.displayManagements = [];
        angular.forEach(result, function(res) {
          if (res.companyRoles.length > 0) {
            angular.forEach(res.companyRoles, function (role) {
              if (role.companyAs == 'Management' && $scope.managements.indexOf(res) == -1) {
                $scope.managements.push(res);
                $scope.displayManagements.push(res);
              }
            });
          } else {
            $scope.managements.push(res);
            $scope.displayManagements.push(res);
          }
        });
      });

    function reset() {
      $scope.management = new Company;
    }
    reset();

    // add management
    $scope.addManagement = function () {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.form.management.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return $scope.management;
          }
        }
      });
      modalInstance.result.then(function () {
        Company.create(
          $scope.management,
          function (result) {
            $scope.managements.push(result);
            toaster.pop('success', '', 'Success to add management');
            reset();
          },
          function (error) {
            console.log(error);
            toaster.pop('error', '', 'Failed to add management');
          }
        );
      });
    };
    // edit management
    $scope.editManagement = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.form.management.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Company.update(
          {where: {code: row.code}},
          row,
          function (result) {
            var index = $scope.managements.indexOf(row);
            if (index !== -1) {
              $scope.managements[index] = result;
            }
            toaster.pop('success', '', 'Success to edit management');
            reset();
          },
          function (error) {
            toaster.pop('error', '', 'Failed to edit management');
          }
        );
      });
    };

    // remove management
    $scope.removeManagement = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.del.management.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Company.removeById(
          {id: row.code},
          function () {
            var index = $scope.managements.indexOf(row);
            if (index !== -1) {
              $scope.managements.splice(index, 1);
            }
            toaster.pop('success', '', 'Success to delete management');
            reset();
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete management');
          }
        );
      });
    };

    $scope.selectedManagement = {};

    $scope.showPropertyPanel = function (row) {
      $scope.showProperties = row.isSelected;
      $scope.selectedManagement = row;

      // TODO: Filter from related model, jadi tidak perlu foreach
      Property.find(
        {filter: {
          include: {
            relation: 'propertyBelongs',
            scope: {
              //where: { and: [{companyAs: 'Management'}, {companyCode: row.code}]}
            }
          }
        }},
        function (result) {
          console.log(result);
          //$scope.properties = result;
          //$scope.displayProperties = [].concat($scope.properties);
          $scope.properties = [];
          $scope.displayProperties = [];

          angular.forEach(result, function(res) {
            if (res.propertyBelongs.length > 0) {
              angular.forEach(res.propertyBelongs, function (role) {
                if (role.companyCode == row.code && $scope.properties.indexOf(res) == -1) {
                  $scope.properties.push(res);
                  $scope.displayProperties.push(res);
                }
              });
            }
          });

          //angular.forEach(result, function(res) {
          //  if (res.propertyBelongs.companyAs == 'Management') {
          //    $scope.properties.push(res);
          //    $scope.displayProperties.push(res);
          //  }
          //});
        });

    };
    // add property
    $scope.addProperty = function () {
      $scope.property = new Property;
      $scope.property.owner = new Company;

      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.form.property.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return $scope.property;
          }
        }
      });
      modalInstance.result.then(function () {
        //console.log($scope.property);
        //console.log($scope.selectedManagement);
        Property.create(
          $scope.property,
          function (result) {

            // Set management
            CompanyPropertyRel.create(
              {companyAs: 'Management', companyCode: $scope.selectedManagement.code, propertyId: result.id}
            );
            // create owner
            Company.create($scope.property.owner,
              function (owner) {
                // Set owner
                CompanyPropertyRel.create(
                  {companyAs: 'Owner', companyCode: owner.code, propertyId: result.id},
                  function (rs) { console.log('rs',rs)},
                  function (error) { console.log(error) }
                );
              },
              function (error) {
                console.log('comp',error);
              }
            );

            $scope.properties.push(result);
            toaster.pop('success', '', 'Success to add property');
          },
          function (error) {
            console.log(error);
            toaster.pop('error', '', 'Failed to add property');
          }
        );
      });
    };

    // edit property
    $scope.editProperty = function (row) {
      //console.log(row);
      //console.log(row.propertyBelongs[0].companyCode);
      //angular.forEach(row.propertyBelongs, function (role) {
      //  if (role.companyAs == 'Owner') {
      //    Company.findById({id: role.companyCode}, function (result) {
      //      row.owner = result;
      //    });
      //  }
      //});

      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.form.property-update.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Property.update(
          {where: {id: row.id}},
          row,
          function (result) {
            var index = $scope.properties.indexOf(row);
            if (index !== -1) {
              $scope.properties[index] = result;
            }
            toaster.pop('success', '', 'Success to edit property');
          },
          function (error) {
            console.log(error);
            toaster.pop('error', '', 'Failed to edit property');
          }
        );
      });
    };

    // remove property
    $scope.removeProperty = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/property/modal.del.property.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        console.log(row);
        var iterate = 0;
        var target = row.propertyBelongs.length - 1;
        angular.forEach(row.propertyBelongs, function(role) {
          CompanyPropertyRel.removeById({id: role.id}, function () {
            iterate++;
            if (iterate == target) {
              Property.removeById({id: row.id},
                function () {
                  toaster.pop('success', '', 'Success to delete property');
                },
                function (error) {
                  toaster.pop('error', '', 'Failed to delete property');
                }
              );
            }
          })
        });
      });
    };

  }]);

//app.controller('SetPropertyScopeCtrl', ['$scope', '$rootScope', '$localStorage', 'Property', '$state', 'toaster',
//  function($scope, $rootScope, $localStorage, Property, $state, toaster) {
//
//    Property.find(
//      {filter: {
//        include: {
//          relation: 'propertyBelongs',
//          scope: {
//            include: 'company'
//          }
//        }
//      }},
//      function (result) {
//        $scope.propertyOptions = result;
//      }
//    );
//
//    console.log($rootScope);
//
//    $scope.app = {};
//
//    if ( angular.isDefined($localStorage.property) ) {
//      if ($localStorage.property.id) {
//        $scope.app.property = $localStorage.property;
//      }
//    }
//
//    $scope.setPropertyScope = function () {
//      console.log($scope);
//      $localStorage.property = $scope.app.property;
//      toaster.pop('success', '', 'Property scope has been set');
//      $state.reload();
//    };
//
//  }]);

app.controller('SettingModalInstanceCtrl', ['$scope', '$modalInstance', 'item',
  function($scope, $modalInstance, item) {
    $scope.item = item;

    $scope.ok = function () {
      $modalInstance.close($scope.id);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
