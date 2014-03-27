/**
 * initialize
 */
window.My = {}
My.App = angular.module('myApp', []);

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
        searchService.searchIssues({repo: $scope.inputRepository, keyword: $scope.inputKeyword});
    }

    var timeout;
    $scope.searchRepositories = function () {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            $scope.repositories = [];

            var splited = $scope.inputRepository.split('/');
            if (splited.length == 2) {
                searchService.searchRepositories({user: splited[0], keyword: splited[1]});
            }
        }, 200);
    }

    // subscribe global events
    $scope.$on('searchIssuesCompleted', function (event, params) {
        $scope.$apply(function () {
            angular.copy(params.response.items, $scope.issues);
        });
    });

    $scope.$on('searchRepositoriesCompleted', function (event, params) {
        $scope.$apply(function () {
            angular.copy(params.response.items, $scope.repositories);
        });
    });
}]);

/**
 * services
 */
My.App.service('searchService', ['$rootScope', function ($rootScope) {
    this.searchIssues = function (params) {
        var url = 'https://api.github.com/search/issues?q=' +
            encodeURIComponent(params.keyword) + '+repo:' + encodeURIComponent(params.repo);

        $.get(url, function (response) {
            // publish global event
            $rootScope.$broadcast('searchIssuesCompleted', {response: response});
        });
    }

    this.searchRepositories = function (params) {
        var url = 'https://api.github.com/search/repositories?q=' +
            'user:' + encodeURIComponent(params.user) + '+' + encodeURIComponent(params.keyword);

        $.get(url, function (response) {
            // publish global event
            $rootScope.$broadcast('searchRepositoriesCompleted', {response: response});
        });
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
