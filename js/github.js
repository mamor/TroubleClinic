/**
 * initialize
 */
if (My === void 0) var My = {};
My.GitHubApp = angular.module('myGitHubApp', ['myAngular', 'ngResource']);

/**
 * controllers
 */
My.GitHubApp.controller('bodyCtrl', ['$scope', function ($scope) {
    $scope.escape = function () {
        $scope.$broadcast('escapeKeyPressed');
    };

    $scope.click = function () {
        $scope.$broadcast('bodyClicked');
    };
}]);

My.GitHubApp.controller('appCtrl', ['$scope', 'searchService', function ($scope, searchService) {
    $scope.reset = function () {
        $('input[ng-model="inputIdentity"]').focus();

        $scope.issues = [];
        $scope.repositories = [];
        $scope.inputIdentity = '';
        $scope.inputKeyword = '';
        $scope.inputState = '';
        $scope.inputFilter = '';
        $scope.loading = false;
    };

    $scope.reset();

    $scope.setIdentity = function (identity) {
        $scope.inputIdentity = identity;
        $scope.repositories = [];
        $('input[ng-model="inputKeyword"]').focus();
    };

    $scope.stateLabel = function (state) {
        return state === 'closed' ? 'danger' : 'success';
    };

    $scope.searchIssues = function () {
        var params = {identity: $scope.inputIdentity, keyword: $scope.inputKeyword, state: $scope.inputState};

        $scope.loading = true;
        $scope.error = false;
        $scope.issues = [];
        searchService.searchIssues(params).then(
            function (result) {
                $scope.loading = false;
                $scope.issues = result.items;
                $('input[ng-model="inputFilter"]').focus();
            },
            function (error) {
                $scope.loading = false;
                $scope.error = 'An error occured with GitHub API. ' + error.data.message;
            }
        );
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

                searchService.searchRepositories(params).then(
                    function (result) {
                        $scope.repositories = result.items;
                    },
                    function (error) {
                        $scope.error = 'An error occured with GitHub API. ' + error.data.message;
                    }
                );
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
My.GitHubApp.service('searchService', ['$resource', '$q', function ($resource, $q) {
    this.searchIssues = function (params) {
        var isRepo = params.identity.split('/').length == 2;

        var url = 'https://api.github.com/search/issues?per_page=100&q=:keyword+' +
            (isRepo ? 'repo::repo' : 'user::user');

        var paramDefaults = isRepo ?
            {keyword: params.keyword, repo: params.identity} : {keyword: params.keyword, user: params.identity};

        if (params.state) {
            url += '+state::state';
            paramDefaults.state = params.state;
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

    this.searchRepositories = function (params) {
        var url = 'https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword';
        var paramDefaults = {user: params.user, keyword: params.keyword};

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
