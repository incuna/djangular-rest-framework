/* global describe, it, expect, module, inject, beforeEach */

(function (_) {

    'use strict';

    describe('drf-field-errors', function () {
        beforeEach(function () {
            module('drf-field-errors')

            inject(function (drfFieldErrors) {
                this.drfFieldErrors = drfFieldErrors;
            });

        });

        describe('clear method', function () {
            it('should clear non-field errors', function () {
                let fields = {
                    errors: ['Non-field error']
                };
                this.drfFieldErrors.clear(fields);

                expect(fields.errors).toEqual([]);
            });

            it('should clear field errors', function () {
                let fields = {
                    field1: {
                        errors: 'Error 1'
                    },
                    field2 : {
                        errors: 'Error 2'
                    }
                };
                this.drfFieldErrors.clear(fields);

                expect(fields.field1.errors).toBe('');
                expect(fields.field2.errors).toBe('');
            });
        });

        describe('set method', function () {
            
            beforeEach(function () {
                this.fields = {
                    errors: [],
                    field1: {
                        errors: ''
                    },
                    field2: {
                        errors: ''
                    }
                };
            });
            

            describe('non-field errors', function () {

                it('should be set when under __all__ property', function () {
                    let errors = {
                        __all__: 'Error'
                    };

                    this.drfFieldErrors.set(this.fields, errors);

                    expect(this.fields.errors[0].msg).toBe('Error');
                });

                it('should be set when under non_field_errors property', function () {
                    let errors = {
                        non_field_errors: 'Error'
                    };

                    this.drfFieldErrors.set(this.fields, errors);

                    expect(this.fields.errors[0].msg).toBe('Error');
                });

                it('should create an array of errors', function () {
                    let errors = {
                        non_field_errors: [
                            'Error1',
                            'Error2'
                        ]
                    };
                    
                    this.drfFieldErrors.set(this.fields, errors);

                    expect(this.fields.errors[0].msg).toBe('Error1');
                    expect(this.fields.errors[1].msg).toBe('Error2');
                });
                
            });

            describe('field errors', function () {

                it('should be set under appropriate fields', function () {
                    let errors = {
                        field1: ['Error1'],
                        field2: ['Error2' ]
                    };

                    this.drfFieldErrors.set(this.fields, errors);

                    expect(this.fields.field1.errors).toBe('Error1');
                    expect(this.fields.field2.errors).toBe('Error2');

                });
            });
        });
    });

}(window._));
