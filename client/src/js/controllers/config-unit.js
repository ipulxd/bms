app.controller('ConfigUnitCtrl', ['$scope', '$localStorage', 'Unit', 'UnitType', 'Building', '$modal', 'toaster',
  function($scope, $localStorage, Unit, UnitType, Building, $modal, toaster) {

    // vars - to remember last selected building
    $scope.option = { selectedBuilding: null};
    $scope.loading = true;

    // building options
    Building.find(
      {filter: {
        where: {propertyId: $localStorage.property.id}
      }},
      function (result) {
        $scope.buildingOptions = result;
        $scope.loading = false;
      });

    // unit type options
    $scope.loadUnitTypes = function () {
      UnitType.find(
        {filter: {
          include: ['building'],
          where: {
            and: [
              {propertyId: $localStorage.property.id},
              {or: [{buildingId: null}, {buildingId: $scope.option.selectedBuilding.id}]}
            ]
          }
        }},
        function (result) {
          //console.log(result);
          $scope.unitTypeOptions = result;
        });
    };

    $scope.loadUnits = function () {

      $scope.loading = true;

      $scope.option.showUnitPanel = true;

      // load unit type related to building
      $scope.loadUnitTypes();

      // index - find unit after select building
      Unit.find(
        {filter: {
          include: ['building', 'unitType'],
          where: {buildingId: $scope.option.selectedBuilding.id}
        }},
        function (result) {
          //console.log('unit result', result);
          $scope.loading = false;
          $scope.units = result;
          $scope.displayUnits = [].concat($scope.units);
        });

    };


    // add
    $scope.add = function () {

      $scope.unit = new Unit;
      //$scope.unit.propertyId = $localStorage.property.id;
      $scope.unit.buildingId = $scope.option.selectedBuilding.id;
      $scope.unit.spaceUnit = 'm2';
      $scope.unit.unitTypeOptions = $scope.unitTypeOptions;
      $scope.unit.buildingInfo = $scope.option.selectedBuilding.code + ': ' + $scope.option.selectedBuilding.name;

      $scope.$watch('unit.unitType', function () {
        //console.log('unit.unitType changed', $scope.unit.unitType);
        if ($scope.unit.unitType){
          $scope.unit.spaceSize = Number($scope.unit.unitType.spaceSize);
        }
      });

      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit/modal.form.unit.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return $scope.unit;
          }
        }
      });
      modalInstance.result.then(function () {
        // unitTypeId
        $scope.unit.unitTypeId = $scope.unit.unitType.id;
        // create code <unitTypeCode><floor><number>
        $scope.unit.code = $scope.unit.unitType.code + $scope.unit.unitFloor + $scope.unit.unitNum;
        //console.log($scope.unit);
        Unit.create(
          $scope.unit,
          function (result) {
            result.unitType = $scope.unit.unitType; // to show unitType name
            $scope.units.push(result);
            toaster.pop('success', '', 'Success to add unit');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to add unit');
          }
        );
      });
    };

    // edit
    $scope.edit = function (row) {
      row.spaceSize = Number(row.spaceSize);
      row.unitTypeOptions = $scope.unitTypeOptions;
      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit/modal.form.unit.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {

        if (row.unitType)
          row.unitTypeId = row.unitType.id;

        Unit.update(
          {where: {id: row.id}},
          row,
          function (result) {
            var index = $scope.units.indexOf(row);
            if (index !== -1) {
              $scope.units[index] = result;
            }
            toaster.pop('success', '', 'Success to edit unit');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to edit unit');
          }
        );
      });
    };

    // remove
    $scope.remove = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/unit/modal.del.unit.html',
        controller: 'SettingModalInstanceCtrl',
        size: 'md',
        resolve: {
          item: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Unit.removeById(
          {id: row.id},
          function () {
            var index = $scope.units.indexOf(row);
            if (index !== -1) {
              $scope.units.splice(index, 1);
            }
            toaster.pop('success', '', 'Success to delete unit');
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete unit');
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
