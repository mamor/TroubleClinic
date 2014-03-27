describe('app.js', function () {
    var provide;
    beforeEach(function () {
        module('myApp', function ($provide) {
            provide = $provide;
        });
    });

    /**
     * controllers
     */
    // TODO:

    /**
     * services
     */
    describe('services', function () {
        describe('searchService', function () {
            describe('#searchIssues()', function () {
                it('should call GitHub search issues API', inject(function ($injector) {
                    // spy $resource
                    var spyMethods = {get: function () {}};
                    spyOn(spyMethods, 'get');

                    var spyResource = jasmine.createSpy('spyResource').and.returnValue(spyMethods);

                    provide.factory('$resource', function () {
                        return spyResource;
                    });

                    // spy $q
                    provide.factory('$q', function () {
                        return {defer: function () {
                            return {promise: 'test'}
                        }};
                    });

                    var result = $injector.get('searchService').searchIssues({keyword: 'x', repo: 'y'});

                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/issues?per_page=100&q=:keyword+repo::repo', {keyword: 'x', repo: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                }));
            });

            describe('#searchRepositories()', function () {
                it('should call GitHub search repositories API', inject(function ($injector) {
                    // spy $resource
                    var spyMethods = {get: function () {}};
                    spyOn(spyMethods, 'get');

                    var spyResource = jasmine.createSpy('spyResource').and.returnValue(spyMethods);

                    provide.factory('$resource', function () {
                        return spyResource;
                    });

                    // spy $q
                    provide.factory('$q', function () {
                        return {defer: function () {
                            return {promise: 'test'}
                        }};
                    });

                    var result = $injector.get('searchService').searchRepositories({user: 'x', keyword: 'y'});

                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword', {user: 'x', keyword: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                }));
            });
        });
    });

    /**
     * directives
     */
    describe('directives', function () {
        var scope;
        var compile;
        beforeEach(inject(function ($rootScope, $compile) {
            scope = $rootScope.$new();
            compile = $compile;
        }));

        describe('myKeypressEnter', function () {
            it('should subscribe keypress 13', function () {
                scope.spyCallback = function (){};
                spyOn(scope, 'spyCallback');

                element = compile('<div my-keypress-enter="spyCallback(1)"></div>')(scope);

                element.trigger($.Event('keypress', {keyCode: 1}));
                expect(scope.spyCallback).not.toHaveBeenCalled();

                element.trigger($.Event('keypress', {keyCode: 13}));
                expect(scope.spyCallback).toHaveBeenCalledWith(1);
            });
        });
    });
});

