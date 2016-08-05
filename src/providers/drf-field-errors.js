(function (angular) {
    'use strict';

    var module = angular.module('drf-field-errors', []);

    module.factory('drfFieldErrors', [
        function () {
            var fieldErrors = {
                clear: function (fields) {
                    // Remove errors from the fields.
                    angular.forEach(fields, function (field, key) {
                        field.errors = '';
                    });
                    fields.errors = [];
                },
                set: function (fields, errors) {
                    angular.forEach(errors, function (error, field) {
                        if (field === '__all__' || field === 'non_field_errors') {
                            var nfErrors = angular.isArray(error) ? error : [error];
                            angular.forEach(nfErrors, function (msg) {
                                fields.errors.push({
                                    msg: msg
                                });
                            });
                        } else {
                            fields[field].errors = error[0];
                        }
                    });
                }
            };

            return fieldErrors;
        }
    ]);

}(window.angular));
