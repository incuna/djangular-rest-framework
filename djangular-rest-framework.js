(function () {
    'use strict';

    angular.module('djangularRestFramework', ['angularExtQ', 'jmdobry.angular-cache'])
        .factory('drf', ['$rootScope', '$http', '$angularCacheFactory', 'extQ', function ($rootScope, $http, $angularCacheFactory, extQ) {
            var equals = angular.equals;
            var forEach = angular.forEach;
            var isDefined = angular.isDefined;
            var isUndefined = angular.isUndefined;

            var cacheOptions = {
                maxAge: 86400000,
                storageMode: 'localStorage'
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

                        deferred.update(data);
                        items = items.concat(data);

                        if (angular.isDefined(response.data.next) && items.length < options.limit) {
                            api.getPage(response.data.next, options, deferred, items);
                        } else {
                            if (isDefined(options.limit)) {
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
                    options = options || {};
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    // Load list of item URLs from urlCache.
                    var cached = api.urlCache.get(url);
                    if (isDefined(options.limit) && isDefined(cached)) {
                        cached = cached.splice(0, options.limit);
                    }
                    forEach(cached, function (url) {
                        var obj = api.objectCache.get(url);
                        if (isDefined(obj)) {
                            deferred.add(obj);
                        }
                    });

                    var seen = {};
                    api.stream(url, options).update(function (list) {
                        // Stream the list
                        forEach(list, function (item) {
                            seen[item.url] = item;
                            var cached = api.objectCache.get(item.url);
                            if (isUndefined(cached)) {
                                api.objectCache.put(item.url, item);
                                deferred.add(item);
                            } else if (!equals(cached, item)) {
                                api.objectCache.put(item.url, item);
                                deferred.update(item);
                            }
                        });
                    }).then(function (list) {
                        // Remove items from the cache if they were not returned
                        // in the list.
                        if (cached) {
                            forEach(cached, function (url) {
                                if (isUndefined(seen[url])) {
                                    deferred.remove(url);
                                    api.objectCache.remove(url);
                                }
                            });
                        }

                        // Update the urlCache with a list of URLs.
                        var urls = [];
                        forEach(list, function (item) {
                            if (isDefined(item.url)) {
                                urls.push(item.url);
                            }
                        });
                        api.urlCache.put(url, urls);

                        deferred.resolve(list);
                    });

                    return deferred.promise;
                },

                loadItem: function (url, options, deferred) {
                    options = options || {};
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    // Load the item from the cache.
                    var cached = api.objectCache.get(url);
                    if (isDefined(cached)) {
                        deferred.add(cached);
                    }

                    api.load(url, options).then(function (response) {
                        var item = response.data;
                        if (isUndefined(cached)) {
                            api.objectCache.put(url, item);
                            deferred.add(item);
                        } else if (!equals(cached, item)) {
                            api.objectCache.put(url, item);
                            deferred.update(item);
                        }

                        deferred.resolve(item);
                    });

                    return deferred.promise;
                },

                loadOptions: function (url, deferred) {
                    deferred = deferred || extQ.defer();

                    // Load the options from the cache.
                    var cached = api.optionsCache.get(url);
                    if (isDefined(cached)) {
                        deferred.resolve(cached);
                    }

                    $http({
                        method: 'OPTIONS',
                        url: url
                    }).then(function (response) {
                        var obj = {data: response.data, url: url};
                        if (!equals(cached, obj)) {
                            api.optionsCache.put(url, obj);
                        }
                        deferred.resolve(obj);
                    }, function (response, status) {
                        deferred.reject({response: response, status: status});
                    });
                }
            };

            return api;
        }]);
}());
