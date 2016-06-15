/* global describe, it, expect, module, inject, beforeEach */

(function (_) {

    'use strict';

    describe('Module filter', function () {
        var displayNameFilter;

        beforeEach(module('drf-display-name-filter'));

        beforeEach(function () {

            inject(function (_drfDisplayNameFilter_) {
                displayNameFilter = _drfDisplayNameFilter_;
                this.displayNameFilter = displayNameFilter;

                this.mockSelected = 'choice 1';
                // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                /* jshint camelcase: false  */
                this.mockData = [
                    {
                        value: 'choice 1',
                        display_name: 'Choice 1'
                    },
                    {
                        value: 'choice 2',
                        display_name: 'Choice 2'
                    },
                    {
                        value: 'choice 3',
                        display_name: 'Choice 3'
                    }
                ];
                // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                /* jshint camelcase: true */
            });

        });

        it('should return original data when it has not been found', function () {
            var choice = 'Choice 4';
            expect(this.displayNameFilter(choice, this.mockData)).toBe(choice);
        });

        it('should return display name when it has a match', function () {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            /* jshint camelcase: false  */
            expect(this.displayNameFilter(this.mockSelected, this.mockData)).toBe(this.mockData[0].display_name);
            /* jshint camelcase: true  */
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        });
    });

}(window._));
