app.controller('ConfigUnitTypeCtrl', ['$scope', '$localStorage', 'UnitType', 'Building', '$modal', 'toaster',
  function($scope, $localStorage, UnitType, Building, $modal, toaster) {

    // vars - to remember last selected building
    $scope.selectedBuilding = null;

    // building options
    $scope.buildingOptions = [].concat({id: null, code: '*', name: 'All buildings'});
    Building.find(
      {filter: {
        where: {propertyId: $localStorage.property.id}
      }},
      function (result) {
        $scope.buildingOptions = $scope.buildingOptions.concat(result);
      });

    // index
    UnitType.find(
      {filter: {
        include: ['building'],
        where: {propertyId: $localStorage.property.id}
      }},
      function (result) {
        $scope.unitTypes = result;
        $scope.displayUnitTypes = [].concat($scope.unitTypes);
      });


    // add
    $scope.add = function () {

      $scope.unitType = new UnitType;
      $scope.unitType.propertyId = $localStorage.property.id;
      $scope.unitType.spaceUnit = 'm2';
      $scope.unitType.buildingOptions = $scope.buildingOptions;
      $scope.unitType.building = $scope.selectedBuilding;

      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit-type/modal.form.unit-type.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return $scope.unitType;
          }
        }
      });
      modalInstance.result.then(function () {
        $scope.selectedBuilding = $scope.unitType.building; // remember last value
        $scope.unitType.buildingId = $scope.unitType.building.id;
        UnitType.create(
          $scope.unitType,
          function (result) {
            result.building = $scope.unitType.building; // to show building name
            $scope.unitTypes.push(result);
            toaster.pop('success', '', 'Success to add unit type');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to add unit type');
          }
        );
      });
    };
    // edit
    $scope.edit = function (row) {
      row.spaceSize = Number(row.spaceSize);
      row.buildingOptions = $scope.buildingOptions;
      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit-type/modal.form.unit-type.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {

        if (row.building)
          row.buildingId = row.building.id;

        UnitType.update(
          {where: {id: row.id}},
          row,
          function (result) {
            var index = $scope.unitTypes.indexOf(row);
            if (index !== -1) {
              $scope.unitTypes[index] = result;
            }
            toaster.pop('success', '', 'Success to edit unit type');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to edit unit type');
          }
        );
      });
    };

    // remove
    $scope.remove = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit-type/modal.del.unit-type.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        UnitType.removeById(
          {id: row.id},
          function () {
            var index = $scope.unitTypes.indexOf(row);
            if (index !== -1) {
              $scope.unitTypes.splice(index, 1);
            }
            toaster.pop('success', '', 'Success to delete unit type');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete unit type');
          }
        );
      });
    };

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
