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
            this.$scope.field = {
                required: true
            };
            let template = '<div drf-form-field="field" label="A label"><input type="text"></div>';
            this.element = this.$compile(template)(this.$scope);
            this.$scope.$digest();
        });

        it('should not have the ng-transclude element', function () {
            let ngTranscludeElement = this.element[0].querySelector('[ng-transclude]');

            console.log(this.element[0]);
            expect(ngTranscludeElement).toBe(null);
        });

        it('should have the transcluded element being the direct child of ".controls"', function () {
            let transcludedElement = this.element[0].querySelector('.controls > input');

            expect(transcludedElement).not.toBe(null);
        });

        it('should have the asterisk if the field is required', function () {
            let asteriskElement = this.element[0].querySelector('.control-label > .asterisk');

            expect(asteriskElement).not.toBe(null);
        });
        
        
    });

}(window._));
