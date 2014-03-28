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
                var spyMethods;
                var spyResource;
                var injector;

                beforeEach(inject(function ($injector) {
                    injector = $injector;

                    // spy $resource
                    spyMethods = {get: function () {}};
                    spyOn(spyMethods, 'get');

                    spyResource = jasmine.createSpy('spyResource').and.returnValue(spyMethods);

                    provide.factory('$resource', function () {
                        return spyResource;
                    });

                    // spy $q
                    provide.factory('$q', function () {
                        return {defer: function () {
                            return {promise: 'test'}
                        }};
                    });
                }));

                it('should call GitHub search issues API by user', function () {
                    var result = injector.get('searchService').searchIssues({keyword: 'x', identity: 'y'});
                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/issues?per_page=100&q=:keyword+user::user', {keyword: 'x', user: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call GitHub search issues API by repo', function () {
                    var result = injector.get('searchService').searchIssues({keyword: 'x', identity: 'y/z'});
                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/issues?per_page=100&q=:keyword+repo::repo', {keyword: 'x', repo: 'y/z'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call GitHub search issues API by state', function () {
                    var result = injector.get('searchService').searchIssues({keyword: 'x', identity: 'y', state: 'z'});
                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/issues?per_page=100&q=:keyword+user::user+state::state', {keyword: 'x', user: 'y', state: 'z'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });
            });

            describe('#searchRepositories()', function () {
                var spyMethods;
                var spyResource;
                var injector;

                beforeEach(inject(function ($injector) {
                    injector = $injector;

                    // spy $resource
                    spyMethods = {get: function () {}};
                    spyOn(spyMethods, 'get');

                    spyResource = jasmine.createSpy('spyResource').and.returnValue(spyMethods);

                    provide.factory('$resource', function () {
                        return spyResource;
                    });

                    // spy $q
                    provide.factory('$q', function () {
                        return {defer: function () {
                            return {promise: 'test'}
                        }};
                    });
                }));

                it('should call GitHub search repositories API', function () {
                    var result = injector.get('searchService').searchRepositories({user: 'x', keyword: 'y'});
                    expect(spyResource).toHaveBeenCalledWith('https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword', {user: 'x', keyword: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });
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

        describe('myKeyupEscape', function () {
            it('should subscribe keyup 27', function () {
                scope.spyCallback = function (){};
                spyOn(scope, 'spyCallback');

                element = compile('<div my-keyup-escape="spyCallback(1)"></div>')(scope);

                element.trigger($.Event('keyup', {keyCode: 1}));
                expect(scope.spyCallback).not.toHaveBeenCalled();

                element.trigger($.Event('keyup', {keyCode: 27}));
                expect(scope.spyCallback).toHaveBeenCalledWith(1);
            });
        });
    });
});

