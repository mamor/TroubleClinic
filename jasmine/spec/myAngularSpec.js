describe('myAngular.js', function () {
    var provide;
    beforeEach(function () {
        module('myAngular', function ($provide) {
            provide = $provide;
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
            var element;
            beforeEach(function () {
                scope.spyCallback = function (){};
                spyOn(scope, 'spyCallback');
                element = compile('<div my-keypress-enter="spyCallback(1)"></div>')(scope);
            });

            it('should not subscribe keypress other than 13', function () {
                element.trigger($.Event('keypress', {keyCode: 1}));
                expect(scope.spyCallback).not.toHaveBeenCalled();
            });

            it('should subscribe keypress 13', function () {
                element.trigger($.Event('keypress', {keyCode: 13}));
                expect(scope.spyCallback).toHaveBeenCalledWith(1);
            });
        });

        describe('myKeyupEscape', function () {
            var element;
            beforeEach(function () {
                scope.spyCallback = function (){};
                spyOn(scope, 'spyCallback');
                element = compile('<div my-keyup-escape="spyCallback(1)"></div>')(scope);
            });

            it('should not subscribe keyup other than 27', function () {
                element.trigger($.Event('keyup', {keyCode: 1}));
                expect(scope.spyCallback).not.toHaveBeenCalled();
            });

            it('should subscribe keyup 27', function () {
                element.trigger($.Event('keyup', {keyCode: 27}));
                expect(scope.spyCallback).toHaveBeenCalledWith(1);
            });
        });
    });

    /**
     * filters
     */
    describe('filters', function () {
        var filter;
        beforeEach(inject(function ($filter) {
            filter = $filter;
        }));

        describe('dateMaybeEmpty', function () {
            it('should return "" when date is empty', function () {
                expect(filter('dateMaybeEmpty')('', 'yyyy-MM-dd')).toBe('');
                expect(filter('dateMaybeEmpty')(0, 'yyyy-MM-dd')).toBe('');
                expect(filter('dateMaybeEmpty')(null, 'yyyy-MM-dd')).toBe('');
                expect(filter('dateMaybeEmpty')(void 0, 'yyyy-MM-dd')).toBe('');
                expect(filter('dateMaybeEmpty')(undefined, 'yyyy-MM-dd')).toBe('');
            });

            it('should return formatting date when date is not empty', function () {
                expect(filter('dateMaybeEmpty')(1388502000000, 'yyyy-MM-dd')).toBe('2014-01-01');
            });
        });
    });
});
