'use strict';

module.exports = function (grunt) {

    // Load external grunt task config.
    grunt.loadTasks('./grunt');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        config: {
            files: {
                lint: [
                    'src/**/*.js'
                ]
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '<%= config.files.lint %>'
            ]
        },
        jscs: {
            options: {
                config: '.jscsrc'
            },
            src: '<%= config.files.lint %>'
        }
    });

    grunt.registerTask('lint', 'Run the JS linters.', [
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('test', 'Run the tests.', function (env) {
        'lint'
    });

};
