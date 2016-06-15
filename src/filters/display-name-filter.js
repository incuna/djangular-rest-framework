(function (angular, _) {
    'use strict';

    var drf = angular.module('drf-display-name-filter', []);

    // A filter to return a display name.
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
