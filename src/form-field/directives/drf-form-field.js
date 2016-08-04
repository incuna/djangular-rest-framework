(function (angular) {
    'use strict';

    var module = angular.module('drf-form-field', []);

    module.directive('drfFormField', [
        '$templateCache',
        function (
            $templateCache
        ) {
            return {
                restrict: 'A',
                scope: true,
                replace: true,
                transclude: true,
                template: function (elem, attrs) {
                    var templateBase = 'templates/drf/';
                    var defaultTemplate = 'drf-form-field.html';
                    var templateUrl = templateBase + (angular.isDefined(attrs.type) ? attrs.type + '.html' : defaultTemplate);
                    return $templateCache.get(templateUrl) || $templateCache.get(templateBase + defaultTemplate);
                },
                link: function (scope, element, attrs) {
                    // Define a default object, so that assigning
                    // scope.label to scope.field.label does not fall over
                    // if scope.field is undefined whilst waiting for an
                    // API response. We'll also need to watch that property on the
                    // scope for changes and update it.
                    scope.field = scope.$eval(attrs.formField) || {};

                    scope.$watch(attrs.formField, function (field) {
                        scope.field = scope.$eval(attrs.formField) || {};
                    });

                    scope.$watch('field', function (field) {
                        scope.label = angular.isDefined(attrs.label) ? attrs.label : scope.field.label;
                    });
                }
            };
        }
    ]);
}(window.angular));
