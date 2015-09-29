angular.module('app')
  .directive('isAllowed', function (Staff) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs, ctrl) {

        var makeVisible = function () {
            elem.removeClass('hidden');
          },
          makeHidden = function () {
            elem.addClass('hidden');
          },
          determineVisibility = function (resetFirst) {
            if (resetFirst) {
              makeHidden(); // hide first
            }

            Staff.isAllowed({
                model: modelMethod[0],
                modelId: '*',
                method: modelMethod[1]
              },
              function (result) {
                if (result.allowed === true) {
                  makeVisible();
                } else {
                  makeHidden();
                }
              });
          },
          modelMethod = attrs.isAllowed.split(':');

        if (modelMethod.length > 0) {
          determineVisibility(true);
        }

      }
    }
  });
