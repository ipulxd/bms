/**
 * Created by saiful.
 */
app.controller('ConfigSystemCtrl', ['$scope', 'Property', 'Company', '$modal', 'toaster',
  function($scope, Property, Company, $modal, toaster) {

    // index
    Property.findOne({},
      function (result) {
        $scope.property = result;
        console.log(result);
      },
      function (error) {
        $scope.property = new Property;
        console.log(error);
      }
    );

    $scope.setConfig = function () {
      console.log($scope.property);
      Property.upsert(
        {},
        $scope.property,
        function () {
          toaster.pop('success', '', 'Setting updated successfully');
        }
      );
    };


  }]);

app.controller('PersonNewCtrl', ['$scope', 'Person', '$state', '$stateParams','toaster',
  function ($scope, Person, $state, $stateParams, toaster) {

    // init
    $scope.person = new Person();
    $scope.idTypeOptions = ['KTP', 'SIM', 'Passport'];
    $scope.sexOptions = ['Male', 'Female'];
    $scope.maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
    $scope.personAddress = [];
    var addressType = ['Home', 'Office', 'Other'];

    // default values
    $scope.person.isCompany = false;

    $scope.addPerson = function () {

      if ($scope.person.isCompany) {
        $scope.person.detailPrivate = {};
      } else {
        $scope.person.detailCompany = {};
      }

      Person.create(
        {},
        $scope.person,
        function (person) {
          toaster.pop('success', '', 'Person '+person.name+' added successfully');
          if ($scope.personAddress.length > 0) {
            $scope.personAddress.forEach(function(address, index) {
              address.name = addressType[index];
              Person.addresses.create({id: person.id}, address);
            });
          }
          $state.go('app.person.list');
        },
        function (error) {
          toaster.pop('error', '', 'Failed to add person!');
        }
      );

    };


  }]);

app.controller('PersonEditCtrl', ['$scope', 'Person', '$state', '$stateParams', 'toaster',
  function ($scope, Person, $state, $stateParams, toaster) {

    // get current
    var addressType = ['Home', 'Office', 'Other'];
    Person.findById({
        id: $stateParams.id,
        filter: { include: ['addresses'] }
      }, function (person) {
        $scope.person = person;

        var l = person.addresses.length;
        var tmpAddress = [];
        for (var i = 0; i < l; i++) {

          person.addresses.forEach(function(address, index) {
            if (address.name == 'Home') {
              tmpAddress.push(address);
              person.addresses.splice(index, 1);
            } else {
              tmpAddress.push({});
            }
          });

          person.addresses.forEach(function(address, index) {
            if (address.name == 'Office') {
              tmpAddress.push(address);
              person.addresses.splice(index, 1);
            } else {
              tmpAddress.push({});
            }
          });

          person.addresses.forEach(function(address, index) {
            if (address.name == 'Other') {
              tmpAddress.push(address);
              person.addresses.splice(index, 1);
            } else {
              tmpAddress.push({});
            }
          });
        }
        $scope.personAddress = [];
        $scope.personAddress = tmpAddress;
      }
    );

    // update
    $scope.updateCustomer = function () {

      if (angular.isUndefined($scope.customer.parentId))
        $scope.customer.parentId = null;

      Person.update(
        { where: {id: $stateParams.id } },
        $scope.customer,
        function () {
          toaster.pop('success', '', 'Data pelanggan berhasil diperbarui');
          $state.go('app.customer.list');
        },
        function (error) {
          toaster.pop('error', '', 'Gagal memperbarui data pelanggan!');
        }
      );

    };

  }]);
