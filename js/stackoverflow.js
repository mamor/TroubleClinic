/**
 * initialize
 */
var My = {};
My.App = angular.module('myApp', ['ngResource']);

/**
 * controllers
 */
My.App.controller('bodyCtrl', ['$scope', function ($scope) {
    $scope.escape = function () {
        $scope.$broadcast('escapeKeyPressed');
    };
}]);

My.App.controller('appCtrl', ['$scope', 'searchService', function ($scope, searchService) {
    $scope.reset = function () {
        $('input[ng-model="inputTags"]').focus();

        $scope.questions = [];
        $scope.inputTags = '';
        $scope.inputInTitle = '';
        $scope.inputKeyword = '';
        $scope.inputClosed = '';
        $scope.inputFilter = '';
    };

    $scope.reset();

    $scope.stateLabel = function (closedDate) {
        return closedDate ? 'danger' : 'success';
    };

    $scope.state = function (closedDate) {
        return closedDate ? 'closed' : 'open';
    };

    $scope.searchQuestions = function () {
        var params = {tagged: $scope.inputTags, title: $scope.inputInTitle, q: $scope.inputKeyword, closed: $scope.inputClosed};

        searchService.searchQuestions(params).then(function (result) {
            $scope.questions = result.items;
            $('input[ng-model="inputFilter"]').focus();
        });
    };

    $scope.$on('escapeKeyPressed', function () {
        $scope.reset();
    });
}]);

/**
 * services
 */
My.App.service('searchService', ['$resource', '$q', function ($resource, $q) {
    this.searchQuestions = function (params) {
        var deferred = $q.defer();

        var url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&site=stackoverflow&pagesize=100';
        var paramDefaults = {};

        if (params.tagged) {
            url += '&tagged=:tagged';
            paramDefaults.tagged = params.tagged;
        }

        if (params.title) {
            url += '&title=:title';
            paramDefaults.title = params.title;
        }

        if (params.q) {
            url += '&q=:q';
            paramDefaults.q = params.q;
        }

        if (params.closed) {
            url += '&closed=:closed';
            paramDefaults.closed = params.closed;
        }

        $resource(url, paramDefaults).get(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };
}]);

/**
 * directives
 */
My.App.directive('myKeypressEnter', [function () {
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

My.App.directive('myKeyupEscape', [function () {
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
My.App.filter('dateMaybeEmpty', ['$filter', function ($filter) {
    return function (date, format) {
        if (! date) {
            return '';
        }

        return $filter('date')(date, format);
    };
}]);
