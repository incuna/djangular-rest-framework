(function (angular, _) {
    'use strict';

    var drf = angular.module('drf-display-name-filter', []);

    // A filter to return a display name.
    // it matches the displayName from an array of objects, and returns the matching display_name.
    // Example
    // choice = 'choice 1';
    //
    // array = [
    //      {
    //          value: 'choice 1',
    //          display_name: 'Choice 1'
    //      },
    //      {
    //          value: 'choice 2',
    //          display_name: 'Choice 2'
    //      },
    //      {
    //          value: 'choice 3',
    //          display_name: 'Choice 3'
    //      }
    //  ];
    // The value returned will be 'Choice 1'
    drf.filter('drfDisplayName', function () {
        return _.memoize(function (displayName, array) {

            var foundName = _.find(array, {
                value: displayName
            });

            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            /* jshint camelcase: false  */
            return foundName ? foundName.display_name : displayName;
            /* jshint camelcase: true */
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        }, function (item, array) {
            return item + JSON.stringify(array);
        });

    });

}(window.angular, window._));
