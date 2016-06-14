'use strict';

module.exports = function (grunt) {

    grunt.config.merge({
        karma: {
            options: {
                basePath: '',
                files: [
                    // Jasmine helpers.
                    'node_modules/jasmine-expect/dist/jasmine-matchers.js',

                    // Angular init.
                    '<%= config.lib %>/angular/angular.js',


                    // Angular libraries.
                    '<%= config.lib %>/angular-cache/dist/angular-cache.js',

                    // Init files first, if any, to register modules.
                    '<%= config.modules %>/**/init.js',
                    '<%= config.modules %>/**/*.js',
                    '<%= config.files.karmaTests %>'
                    // 'tests/unit/dashboard/**/*'
                ],
                exclude: [],
                frameworks: ['jasmine'],
                plugins: [
                    'karma-jasmine',
                    'karma-coverage',
                    'karma-spec-reporter',
                    'karma-chrome-launcher',
                    'karma-firefox-launcher',
                    'karma-safari-launcher'
                ],
                preprocessors: {
                    '<%= config.files.templatesHTML %>': 'ng-html2js',
                    '<%= config.files.scripts %>': 'coverage'
                },
                reporters: ['dots', 'coverage'],
                coverageReporter: {
                    dir: 'coverage',
                    type: 'lcov'
                },
                port: 9876,
                colors: true,
                browsers: ['Chrome', 'Firefox', 'Safari'],
                singleRun: true,
                logLevel: 'INFO'
            },
            ci: {
                // Travis only allows Firefox.
                browsers: ['Firefox'],
                reporters: ['dots', 'coverage'],
                coverageReporter: {
                    type: 'lcovonly',
                    // Travis uses this path: coverage/lcov.info
                    subdir: '.',
                    file: 'lcov.info'
                },
                logLevel: 'WARN'
            },
            dev: {
                reporters: ['dots', 'coverage']
            },
            verbose: {
                reporters: ['spec', 'coverage']
            },
            debug: {
                reporters: ['spec', 'coverage'],
                logLevel: 'DEBUG'
            },
            watch: {
                // One browser to be quicker.
                browsers: ['Firefox'],
                reporters: ['progress', 'coverage'],
                autoWatch: true,
                singleRun: false,
                // INFO level logs when a file is changed: better feedback.
                logLevel: 'INFO'
            }
        }
    });

};
