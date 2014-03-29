describe('github.js', function () {
    var provide;
    beforeEach(function () {
        module('myGitHubApp', function ($provide) {
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
                var baseUrl;

                beforeEach(inject(function ($injector) {
                    baseUrl = 'https://api.github.com/search/issues?per_page=100&q=:keyword+';
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
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + 'user::user', {keyword: 'x', user: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call GitHub search issues API by repo', function () {
                    var result = injector.get('searchService').searchIssues({keyword: 'x', identity: 'y/z'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + 'repo::repo', {keyword: 'x', repo: 'y/z'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call GitHub search issues API by state', function () {
                    var result = injector.get('searchService').searchIssues({keyword: 'x', identity: 'y', state: 'z'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + 'user::user+state::state', {keyword: 'x', user: 'y', state: 'z'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });
            });

            describe('#searchRepositories()', function () {
                var spyMethods;
                var spyResource;
                var injector;
                var baseUrl;

                beforeEach(inject(function ($injector) {
                    baseUrl = 'https://api.github.com/search/repositories?per_page=100&q=user::user+:keyword';
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
                    expect(spyResource).toHaveBeenCalledWith(baseUrl, {user: 'x', keyword: 'y'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function));
                    expect(result).toBe('test');
                });
            });
        });
    });
});

