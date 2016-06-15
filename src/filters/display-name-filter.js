(function (angular, _) {
    'use strict';

    var drf = angular.module('drf-display-name-filter', []);

    // A filter to return a display name.
    drf.filter('drfDisplayName', function () {
        return _.memoize(function (item, array) {
            var displayName = item;

            var foundName = _.find(array, function (arrayItem) {
                if (item === arrayItem.value) {
                    return arrayItem;
                }
            });

            if (foundName) {
                // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                /* jshint camelcase: false  */
                displayName = foundName.display_name;
                /* jshint camelcase: true */
                // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            }

            return displayName;

        }, function (item, array) {
            return item + JSON.stringify(array);
        });

    });

}(window.angular, window._));
