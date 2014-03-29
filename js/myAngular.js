/**
 * initialize
 */
if (My === void 0) var My = {};
My.Angular = angular.module('myAngular', []);

/**
 * directives
 */
My.Angular.directive('myKeypressEnter', [function () {
    return function (scope, element, attrs) {
        element.on('keypress', function (event) {
            if (event.keyCode === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myKeypressEnter);
                });
            }
        });
    };
}]);

My.Angular.directive('myKeyupEscape', [function () {
    return function (scope, element, attrs) {
        element.on('keyup', function (event) {
            if (event.keyCode === 27) {
                scope.$apply(function () {
                    scope.$eval(attrs.myKeyupEscape);
                });
            }
        });
    };
}]);

/**
 * filters
 */
My.Angular.filter('dateMaybeEmpty', ['$filter', function ($filter) {
    return function (date, format) {
        if (! date) {
            return '';
        }

        return $filter('date')(date, format);
    };
}]);
