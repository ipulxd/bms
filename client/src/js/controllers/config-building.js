app.controller('ConfigBuildingCtrl', ['$scope', '$localStorage', '$state', 'Building', 'Property', '$modal', 'toaster',
  function($scope, $localStorage, $state, Building, Property, $modal, toaster) {

    if ( angular.isDefined($localStorage.property) ) {
      if ($localStorage.property.id) {
        $scope.app.property = $localStorage.property;
      } else {
        $state.go('setting.property.set-scope');
      }
    } else {
      $state.go('setting.property.set-scope');
    }

    // index
    Building.find(
      {filter: {
        where: {propertyId: $localStorage.property.id}
      }},
      function (result) {
        $scope.buildings = result;
        $scope.displayBuildings = [].concat($scope.buildings);
      });

    // remove
    $scope.remove = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/building/modal.del.building.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Building.deleteById(
          { id: row.id },
          function () {
            var index = $scope.buildings.indexOf(row);
            if (index !== -1) {
              $scope.buildings.splice(index, 1);
              toaster.pop('success', '', 'Success to delete building');
            }
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete building');
          }
        );
      });
    };

  }]);

app.controller('BuildingNewCtrl', ['$scope', '$localStorage', '$state', 'Building', 'toaster',
  function($scope, $localStorage, $state, Building, toaster) {

    if ( angular.isDefined($localStorage.property) ) {
      if ($localStorage.property.id) {
        $scope.building = new Building;
        $scope.building.propertyId = $localStorage.property.id;
        $scope.building.floorNum = 1;
      } else {
        $state.go('setting.property.set-scope');
      }
    } else {
      $state.go('setting.property.set-scope');
    }

    $scope.addBuilding = function () {

      Building.create(
        $scope.building,
        function (result) {
          toaster.pop('success', '', 'Building '+result.name+' added successfully');
          $state.go('setting.building.list');
        },
        function (error) {
          toaster.pop('error', '', 'Failed to add building!');
        }
      );
    }

  }]);


app.controller('BuildingEditCtrl', ['$scope', '$localStorage', '$state', '$stateParams', 'Building', 'toaster',
  function($scope, $localStorage, $state, $stateParams, Building, toaster) {

    if ( angular.isDefined($localStorage.property) ) {
      if ($localStorage.property.id) {

        Building.findById({id: $stateParams.id}, function (result) {
          $scope.building = result;
        });

      } else {
        $state.go('setting.property.set-scope');
      }
    } else {
      $state.go('setting.property.set-scope');
    }

    $scope.editBuilding = function () {

      Building.update(
        { where: {id: $stateParams.id } },
        $scope.building,
        function (result) {
          toaster.pop('success', '', 'Building '+result.name+' updated successfully');
          $state.go('setting.building.list');
        },
        function (error) {
          toaster.pop('error', '', 'Failed to update building!');
        }
      );
    }

  }]);

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
