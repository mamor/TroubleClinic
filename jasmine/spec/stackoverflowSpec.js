describe('github.js', function () {
    var provide;
    beforeEach(function () {
        module('myStackOverflowApp', function ($provide) {
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
            describe('#searchQuestions()', function () {
                var spyMethods;
                var spyResource;
                var injector;
                var baseUrl;

                beforeEach(inject(function ($injector) {
                    baseUrl = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=votes&site=stackoverflow&pagesize=100';
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

                it('should call Stack Overflow search question API with tagged', function () {
                    var result = injector.get('searchService').searchQuestions({tagged: 'x'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + '&tagged=:tagged', {tagged: 'x'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call Stack Overflow search question API with title', function () {
                    var result = injector.get('searchService').searchQuestions({title: 'x'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + '&title=:title', {title: 'x'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call Stack Overflow search question API with q', function () {
                    var result = injector.get('searchService').searchQuestions({q: 'x'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + '&q=:q', {q: 'x'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                    expect(result).toBe('test');
                });

                it('should call Stack Overflow search question API with closed', function () {
                    var result = injector.get('searchService').searchQuestions({closed: 'x'});
                    expect(spyResource).toHaveBeenCalledWith(baseUrl + '&closed=:closed', {closed: 'x'});
                    expect(spyMethods.get).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Function));
                    expect(result).toBe('test');
                });
            });
        });
    });
});

