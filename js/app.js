window.My = {}
My.App = angular.module('myApp', []);

My.App.controller('formCtrl', ['$scope', '$element', 'searchService', 'repositoryService', function ($scope, $element, searchService, repositoryService) {
    $scope.issues = [];
    $scope.repos = [];
    $scope.repository = '';
    $scope.keyword = '';

    var timeout;

    $scope.search = function () {
        searchService.search({repository: $scope.repository, keyword: $scope.keyword});
    }

    $element.on('keypress', function (event) {
        if (event.keyCode === 13) {
            searchService.search({repository: $scope.repository, keyword: $scope.keyword});
        }
    });

    $element.on('keyup', '[ng-model="repository"]', function (event) {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if ($scope.repository.match('/')) {
                repositoryService.search({user: $scope.repository.split('/')[0], keyword: $scope.repository.split('/')[1]});
            } else {
                $scope.repos = [];
            }
        }, 300);
    });

    $scope.$on('searchCompleted', function (event, response) {
        $scope.$apply(function () {
            angular.copy(response.issues, $scope.issues);
        });
    });

    $scope.$on('repositoryCompleted', function (event, response) {
        $scope.$apply(function () {
            angular.copy(response.repos, $scope.repos);
        });
    });

    $scope.selectRepository = function(repository) {
        $scope.repository = repository;
        $scope.repos = [];
    };

}]);

My.App.service('searchService', ['$rootScope', function ($rootScope) {
    this.search = function (params) {
        var url = 'https://api.github.com/search/issues?q=';
        url += encodeURIComponent(params.keyword) + '+repo:' + encodeURIComponent(params.repository);

        $.get(url, function (response) {
            $rootScope.$broadcast('searchCompleted', {
                issues: response.items
            });
        });
    }
}]);

My.App.service('repositoryService', ['$rootScope', function ($rootScope) {
    this.search = function (params) {
        var url = 'https://api.github.com/search/repositories?q=';
        url += 'user:' + encodeURIComponent(params.user) + '+' + encodeURIComponent(params.keyword);

        $.get(url, function (response) {
            $rootScope.$broadcast('repositoryCompleted', {
                repos: response.items
            });
        });
    }
}]);