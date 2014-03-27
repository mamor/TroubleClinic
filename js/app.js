/**
 * initialize
 */
window.My = {}
My.App = angular.module('myApp', ['ngResource']);

/**
 * controllers
 */
My.App.controller('appCtrl', ['$scope', '$element', 'searchService', function ($scope, $element, searchService) {
    $scope.issues = [];
    $scope.repositories = [];
    $scope.inputRepository = '';
    $scope.inputKeyword = '';

    $scope.selectRepository = function(repository) {
        $scope.inputRepository = repository;
        $scope.repositories = [];
    };

    // search
    $scope.searchIssues = function () {
        var params = {repo: $scope.inputRepository, keyword: $scope.inputKeyword};

        searchService.searchIssues(params).then(function (result) {
            $scope.issues = result.items;
        });
    }

    var timeout;
    $scope.searchRepositories = function () {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $scope.repositories = [];

            var splited = $scope.inputRepository.split('/');

            if (splited.length == 2) {
                var params = {user: splited[0], keyword: splited[1]};

                searchService.searchRepositories(params).then(function (result) {
                    $scope.repositories = result.items;
                });
            }
        }, 200);
    }
}]);

/**
 * services
 */
My.App.service('searchService', ['$resource', '$q', function ($resource, $q) {
    this.searchIssues = function (params) {
        var deferred = $q.defer();

        var url = 'https://api.github.com/search/issues?per_page=100&q=:keyword+repo::repo';
        var paramDefaults = {keyword: params.keyword, repo: params.repo};

        $resource(url, paramDefaults).get(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    this.searchRepositories = function (params) {
        var deferred = $q.defer();

        var url = 'https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword';
        var paramDefaults = {user: params.user, keyword: params.keyword};

        $resource(url, paramDefaults).get(function (response) {
                deferred.resolve(response);
        });

        return deferred.promise;
    }
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
