(function (angular) {
    'use strict';

    var drf = angular.module('drf-config', [
        'angularExtQ',
        'jmdobry.angular-cache'
    ]);

    drf.provider('drfConfig', function () {
        var cacheEnabled = true;
        var cacheOptions = {
            maxAge: 86400000,
            storageMode: 'localStorage',
            verifyIntegrity: false
        };
        var defaultOptions = {
            cacheItems: true,
            params: {}
        };

        return {
            $get: function () {
                return {
                    cacheEnabled: function () {
                        return cacheEnabled;
                    },
                    cacheOptions: function () {
                        return cacheOptions;
                    },
                    defaultOptions: function () {
                        return defaultOptions;
                    }
                };
            },
            setCacheEnabled: function (value) {
                cacheEnabled = value;
            },
            setCacheOptions: function (value) {
                cacheOptions = angular.extend({}, cacheOptions, value);
            },
            setDefaultOptions: function (value) {
                defaultOptions = angular.extend({}, defaultOptions, value);
            }
        };
    });

}(window.angular));
