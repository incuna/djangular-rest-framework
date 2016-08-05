/* global describe, it, expect, module, inject, beforeEach */
/* jshint es3:false, esnext:true */

(function (_) {

    'use strict';

    describe('drf-form-field', function () {
        beforeEach(function () {
            module('drf-form-field');

            inject(function ($rootScope, $compile) {
                this.$rootScope = $rootScope;
                this.$compile = $compile;
            });

            this.$scope = this.$rootScope.$new();
            let template = '<div drf-form-field><input type="text"></div>';
            this.element = this.$compile(template)(this.$scope);
            this.$scope.$digest();
        });

        it('should not have the ng-transclude element', function () {
            let ngTranscludeElement = this.element[0].querySelector('[ng-transclude]');

            expect(ngTranscludeElement).toBe(null);
        });

        it('should have the transcluded element being the direct child of ".controls"', function () {
            let transcludedElement = this.element[0].querySelector('.controls > input');

            expect(transcludedElement).not.toBe(null);
        });
        
    });

}(window._));
