/* global beforeEach, module, inject, describe, it, expect */

(function () {

    'use strict';

    describe('Module drf-config', function () {

         // Load the generic module.
        beforeEach(module('drf-config'));

        beforeEach(function () {

            inject(function (drfConfig) {
                this.drfConfig = drfConfig;
            });

        });

        it('should have a default value for cacheOptions.maxAge', function () {
            expect(this.drfConfig.cacheOptions().maxAge).toBe(86400000);
        });

        it('should have a default value for cacheEnabled', function () {
            expect(this.drfConfig.cacheEnabled()).toBe(true);
        });

        it('should have a default value for defaultOptions.cacheItems', function () {
            expect(this.drfConfig.defaultOptions().cacheItems).toBe(true);
        });

    });
}());
