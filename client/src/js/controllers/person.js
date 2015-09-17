/**
 * Created by saiful.
 */
app.controller('PersonIndexCtrl', ['$scope', 'Person', 'PersonAddress', '$modal', 'toaster',
  function($scope, Person, PersonAddress, $modal, toaster) {

    //  pagination
    $scope.itemsByPage=20;

    // index
    Person.find({}, function (result) {
      $scope.people = result;
      $scope.displayPeople = [].concat($scope.people);
    });

    // remove
    $scope.remove = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/person/modal.delete.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          person: function () {
            return row;
          }
        }
      });
      modalInstance.result.then(function () {
        Person.deleteById(
          { id: row.id },
          function () {
            var index = $scope.people.indexOf(row);
            if (index !== -1) {
              $scope.people.splice(index, 1);
              toaster.pop('success', '', 'Person deleted successfully');
            }
          },
          function (error) {
            toaster.pop('error', '', 'Failed to delete person!');
          }
        );
      });
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

app.controller('CustomerNewChildCtrl', ['$scope', 'Customer', '$state', '$stateParams', 'toaster',
  function ($scope, Customer, $state, $stateParams, toaster) {

    // init
    $scope.customer = new Customer();
    // default values
    $scope.customer.isGroup = false;
    $scope.customer.active = true;
    $scope.customer.orderMethodName = $stateParams.type;
    $scope.customer.parentId = $stateParams.id;

    // get parent
    Customer.findById(
      {id: $stateParams.id},
      {
        filter: {
          where: {
            and: [
              { isGroup: true },
              { active: true }
            ]
          }
        }
      }, function (result) {
        $scope.customer.parent = result;
      });

    // add
    $scope.addCustomer = function () {

      // security
      $scope.customer.isGroup = false;
      $scope.customer.parentId = $stateParams.id;

      Customer.create(
        {},
        $scope.customer,
        function () {
          toaster.pop('success', '', 'Pelanggan berhasil ditambahkan');
          $state.go('app.customer.list');
        },
        function (error) {
          toaster.pop('error', '', 'Gagal menambahkan pelanggan!');
        }
      );

    };

  }]);

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'person',
  function($scope, $modalInstance, person) {
    $scope.person = person;

    $scope.ok = function () {
      $modalInstance.close($scope.id);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);

