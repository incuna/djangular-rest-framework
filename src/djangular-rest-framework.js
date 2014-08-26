(function (angular) {
    'use strict';

    var module = angular.module('djangularRestFramework', [
        'angularExtQ',
        'jmdobry.angular-cache'
    ]);

    module.factory('drf', [
        '$http',
        '$angularCacheFactory',
        'extQ',
        function ($http, $angularCacheFactory, extQ) {
            var cacheOptions = {
                maxAge: 86400000,
                storageMode: 'localStorage'
            };

            var defaultOptions = {
                cache: true
            };

            var api = {
                optionsCache: $angularCacheFactory('optionsCache', cacheOptions),
                urlCache: $angularCacheFactory('urlCache', cacheOptions),
                objectCache: $angularCacheFactory('objectCache', cacheOptions),

                getPage: function (url, options, deferred, items) {
                    $http({
                        method: 'GET',
                        url: url,
                        params: options.params
                    }).then(function (response) {
                        // If the response has pages it will be structured
                        // differently.
                        var data;
                        if (angular.isDefined(response.data.results)) {
                            data = response.data.results;
                        } else {
                            data = response.data;
                        }

                        if (angular.isDefined(response.data.count) && angular.isUndefined(options.limit)) {
                            options.limit = response.data.count;
                        }

                        deferred.update(data);
                        items = items.concat(data);

                        if (angular.isDefined(response.data.next) && response.data.next !== null && items.length < options.limit) {
                            api.getPage(response.data.next, options, deferred, items);
                        } else {
                            if (angular.isDefined(options.limit)) {
                                items = items.splice(0, options.limit);
                            }
                            deferred.resolve(items);
                        }

                    }, function (response, status) {
                        deferred.reject({response: response, status: status});
                    });
                },

                stream: function (url, options) {
                    var deferred = extQ.defer(['update']);
                    var items = [];

                    api.getPage(url, options, deferred, items);

                    return deferred.promise;
                },

                load: function (url, options) {
                    var deferred = extQ.defer();

                    $http({
                        method: 'GET',
                        url: url,
                        params: options.params
                    }).then(function (response) {
                        deferred.resolve(response);
                    }, function (response, status) {
                        deferred.reject({response: response, status: status});
                    });

                    return deferred.promise;
                },


                loadList: function (url, options, deferred) {
                    options = angular.extend({}, defaultOptions, options);
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    if (options.cache) {
                        // Load list of item URLs from urlCache.
                        var cached = api.urlCache.get(url);
                        if (angular.isDefined(options.limit) && isDefined(cached)) {
                            cached = cached.splice(0, options.limit);
                        }
                        angular.forEach(cached, function (url) {
                            var obj = api.objectCache.get(url);
                            if (angular.isDefined(obj)) {
                                deferred.add(obj);
                            }
                        });
                    }

                    var seen = {};
                    api.stream(url, options).update(function (list) {
                        // Stream the list
                        angular.forEach(list, function (item) {
                            seen[item.url] = item;
                            if (options.cache) {
                                var cached = api.objectCache.get(item.url);
                                if (angular.isUndefined(cached)) {
                                    api.objectCache.put(item.url, item);
                                    deferred.add(item);
                                } else if (!angular.equals(cached, item)) {
                                    api.objectCache.put(item.url, item);
                                    deferred.update(item);
                                }
                            } else {
                                deferred.add(item);
                            }
                        });
                    }).then(function (list) {
                        if (options.cache) {
                            // Remove items from the cache if they were not returned
                            // in the list.
                            if (cached) {
                                angular.forEach(cached, function (url) {
                                    if (angular.isUndefined(seen[url])) {
                                        deferred.remove(url);
                                        api.objectCache.remove(url);
                                    }
                                });
                            }

                            // Update the urlCache with a list of URLs.
                            var urls = [];
                            angular.forEach(list, function (item) {
                                if (angular.isDefined(item.url)) {
                                    urls.push(item.url);
                                }
                            });
                            api.urlCache.put(url, urls);
                        }

                        deferred.resolve(list);
                    });

                    return deferred.promise;
                },

                loadItem: function (url, options, deferred) {
                    options = angular.extend({}, defaultOptions, options);
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    if (options.cache) {
                        // Load the item from the cache.
                        var cached = api.objectCache.get(url);
                        if (angular.isDefined(cached)) {
                            deferred.add(cached);
                        }
                    }

                    api.load(url, options).then(function (response) {
                        var item = response.data;
                        if (options.cache) {
                            if (angular.isUndefined(cached)) {
                                api.objectCache.put(url, item);
                                deferred.add(item);
                            } else if (!angular.equals(cached, item)) {
                                api.objectCache.put(url, item);
                                deferred.update(item);
                            }
                        }

                        deferred.resolve(item);
                    });

                    return deferred.promise;
                },

                loadOptions: function (url, options, deferred) {
                    options = angular.extend({}, defaultOptions, options);
                    deferred = deferred || extQ.defer();

                    if (options.cache) {
                        // Load the options from the cache.
                        var cached = api.optionsCache.get(url);
                        if (angular.isDefined(cached)) {
                            deferred.resolve({data: cached, url: url});
                        }
                    }

                    $http({
                        method: 'OPTIONS',
                        url: url
                    }).then(function (response) {
                        if (options.cache) {
                            if (!angular.equals(cached, response.data)) {
                                api.optionsCache.put(url, response.data);
                            }
                        }

                        deferred.resolve({data: response.data, url: url});
                    }, function (response, status) {
                        deferred.reject({response: response, status: status});
                    });

                    return deferred.promise;
                }
            };

            return api;
        }
    ]);
}(window.angular));
