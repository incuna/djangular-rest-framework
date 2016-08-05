angular.module('drf-form-field.templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/drf/form-field/form-field.html',
    "<div class=control-group ng-class=\"{error: field.errors.length}\"><label class=control-label ng-if=label bind-html-compile=label></label><div class=controls><div class=transclude-container></div><span class=asterisk ng-if=field.required>*</span><div class=\"errors help-block\" ng-if=field.errors bind-html-compile=field.errors></div><div class=\"help help-block\" ng-if=field.help_text><span bind-html-compile=field.help_text></span></div></div></div>"
  );

}]);
