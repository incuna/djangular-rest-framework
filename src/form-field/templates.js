angular.module('drf-form-field.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/drf/form-field/form-field.html',
    "<div class=control-group ng-class=\"{error: field.errors.length, required: field.required}\"><label ng-if=label class=control-label for=\"{{ scope.field.id }}\"><span bind-html-compile=label></span> <span ng-if=field.required class=asterisk>*</span></label><div class=controls><div class=transclude-container></div><div class=\"error-block field-error\" ng-if=field.errors><p class=error bind-html-compile=field.errors></p></div><p class=field-help-text ng-if=field.help_text bind-html-compile=field.help_text></p></div></div>"
  );

}]);
