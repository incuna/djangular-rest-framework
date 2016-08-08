(function (angular) {
    'use strict';

    var module = angular.module('drf-form-field', [
        'drf-form-field.templates',
        'angular-bind-html-compile'
    ]);

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
                    var templateBase = 'templates/drf/form-field/';
                    var defaultTemplate = 'form-field.html';
                    var templateUrl = templateBase + (angular.isDefined(attrs.type) ? attrs.type + '.html' : defaultTemplate);
                    return $templateCache.get(templateUrl) || $templateCache.get(templateBase + defaultTemplate);
                },
                link: function (scope, element, attrs, ctrl, transcludeFn) {
                    // Define a default object, so that assigning
                    // scope.label to scope.field.label does not fall over
                    // if scope.field is undefined whilst waiting for an
                    // API response. We'll also need to watch that property on the
                    // scope for changes and update it.
                    scope.field = scope.$eval(attrs.drfFormField) || {};

                    scope.$watch(attrs.drfFormField, function (field) {
                        scope.field = scope.$eval(attrs.drfFormField) || {};
                    });

                    scope.$watch('field', function (field) {
                        scope.label = angular.isDefined(attrs.label) ? attrs.label : scope.field.label;
                    });

                    transcludeFn(function (clone) {
                        var transcludeContainer = angular.element(element[0].querySelector('.transclude-container'));
                        transcludeContainer.replaceWith(clone);
                    });
                }
            };
        }
    ]);
}(window.angular));
