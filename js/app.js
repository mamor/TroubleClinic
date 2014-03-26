window.My = {}
My.App = angular.module('myApp', []);

My.App.controller('formCtrl', ['$scope', '$element', 'searchService', function ($scope, $element, searchService) {
    $scope.issues = [];
    $scope.repository = '';
    $scope.keyword = '';

    $scope.search = function () {
        searchService.search({repository: $scope.repository, keyword: $scope.keyword});
    }

    $element.on('keypress', function (event) {
        if (event.keyCode === 13) {
            searchService.search({repository: $scope.repository, keyword: $scope.keyword});
        }
    });

    $scope.$on('searchCompleted', function (event, response) {
        $scope.$apply(function () {
            angular.copy(response.issues, $scope.issues);
        });
    });
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
