/**
 * initialize
 */
var My = {};
My.App = angular.module('myApp', ['ngResource']);

/**
 * controllers
 */
My.App.controller('bodyCtrl', ['$scope', function ($scope) {
    $scope.click = function () {
        $scope.$broadcast('bodyClicked');
    };

    $scope.escape = function () {
        $scope.$broadcast('escapeKeyPressed');
    };
}]);

My.App.controller('appCtrl', ['$scope', 'searchService', function ($scope, searchService) {
    $scope.reset = function () {
        $('input[ng-model="inputIdentity"]').focus();

        $scope.issues = [];
        $scope.repositories = [];
        $scope.inputIdentity = '';
        $scope.inputKeyword = '';
        $scope.inputFilter = '';
    };

    $scope.reset();

    $scope.setIdentity = function (identity) {
        $scope.inputIdentity = identity;
        $scope.repositories = [];
        $('input[ng-model="inputKeyword"]').focus();
    };

    $scope.issueLabel = function (state) {
        return state === 'closed' ? 'danger' : 'success';
    };

    $scope.searchIssues = function () {
        var params = {identity: $scope.inputIdentity, keyword: $scope.inputKeyword};

        searchService.searchIssues(params).then(function (result) {
            $scope.issues = result.items;
            $('input[ng-model="inputFilter"]').focus();
        });
    };

    var timeout;
    $scope.searchRepositories = function () {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            $scope.$apply(function () {
                angular.copy([], $scope.repositories);
            });

            var splited = $scope.inputIdentity.split('/');

            if (splited.length == 2) {
                var params = {user: splited[0], keyword: splited[1]};

                searchService.searchRepositories(params).then(function (result) {
                    $scope.repositories = result.items;
                });
            }
        }, 200);
    };

    $scope.$on('bodyClicked', function () {
        $scope.repositories = [];
    });

    $scope.$on('escapeKeyPressed', function () {
        $scope.reset();
    });
}]);

/**
 * services
 */
My.App.service('searchService', ['$resource', '$q', function ($resource, $q) {
    this.searchIssues = function (params) {
        var deferred = $q.defer();

        var isRepo = params.identity.split('/').length == 2;

        var url = 'https://api.github.com/search/issues?per_page=100&q=:keyword+' +
            (isRepo ? 'repo::repo' : 'user::user');

        var paramDefaults = isRepo ?
            {keyword: params.keyword, repo: params.identity} : {keyword: params.keyword, user: params.identity};

        $resource(url, paramDefaults).get(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    this.searchRepositories = function (params) {
        var deferred = $q.defer();

        var url = 'https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword';
        var paramDefaults = {user: params.user, keyword: params.keyword};

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
