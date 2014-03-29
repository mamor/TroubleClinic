/**
 * initialize
 */
if (My === void 0) var My = {};
My.StackOverflowApp = angular.module('myStackOverflowApp', ['myAngular', 'ngResource']);

/**
 * controllers
 */
My.StackOverflowApp.controller('bodyCtrl', ['$scope', function ($scope) {
    $scope.escape = function () {
        $scope.$broadcast('escapeKeyPressed');
    };
}]);

My.StackOverflowApp.controller('appCtrl', ['$scope', 'searchService', function ($scope, searchService) {
    $scope.reset = function () {
        $('input[ng-model="inputTags"]').focus();

        $scope.questions = [];
        $scope.inputTags = '';
        $scope.inputInTitle = '';
        $scope.inputKeyword = '';
        $scope.inputClosed = '';
        $scope.inputFilter = '';
        $scope.loading = false;
        $scope.error = false;
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

        $scope.loading = true;
        $scope.error = false;
        $scope.questions = [];
        searchService.searchQuestions(params).then(
            function (result) {
                $scope.loading = false;
                $scope.questions = result.items;
                $('input[ng-model="inputFilter"]').focus();
            },
            function (error) {
                $scope.loading = false;
                $scope.error = 'An error occured with Stack Overflow API. ' + error.data.error_name;
            }
        );
    };

    $scope.$on('escapeKeyPressed', function () {
        $scope.reset();
    });
}]);

/**
 * services
 */
My.StackOverflowApp.service('searchService', ['$resource', '$q', function ($resource, $q) {
    this.searchQuestions = function (params) {
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

        var deferred = $q.defer();

        $resource(url, paramDefaults).get(
            function (response) {
                deferred.resolve(response);
            },
            function (error) {
                deferred.reject(error);
            }
        );

        return deferred.promise;
    };
}]);
