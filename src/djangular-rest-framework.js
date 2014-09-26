(function (angular) {
    'use strict';

    var module = angular.module('djangularRestFramework', [
        'angularExtQ',
        'jmdobry.angular-cache'
    ]);

    module.factory('drf', [
        '$http',
        '$timeout',
        '$angularCacheFactory',
        'extQ',
        function ($http, $timeout, $angularCacheFactory, extQ) {
            var objectToQueryString = function(obj){
                var str = [];
                angular.forEach(obj, function (value, key) {
                    str.push(key + '=' + encodeURIComponent(value));
                });
                return str.join('&');
            };

            var formatUrl = function (url, params) {
                var queryString = objectToQueryString(params);

                if (queryString) {
                    url = url + '?' + queryString;
                }
                return url;
            };

            var cacheOptions = {
                maxAge: 86400000,
                storageMode: 'localStorage'
            };

            var defaultOptions = {
                cacheItems: true,
                params: {}
            };

            var api = {
                optionsCache: $angularCacheFactory('optionsCache', cacheOptions),
                urlCache: $angularCacheFactory('urlCache', cacheOptions),
                objectCache: $angularCacheFactory('objectCache', cacheOptions),

                getPage: function (url, options, deferred, items) {
                    var httpOptions = angular.extend({
                        method: 'GET',
                        url: url
                    }, options);

                    $http(httpOptions)
                        .then(function (response) {
                            // If the response has pages it will be structured
                            // differently.
                            var data;
                            if (angular.isDefined(response.data.results)) {
                                data = response.data.results;
                            } else {
                                data = response.data;
                            }

                            // If the response countains a count then set the limit.
                            if (angular.isDefined(response.data.count) && angular.isUndefined(options.params.limit)) {
                                options.params.limit = response.data.count;
                            }

                            // Check the current length of the items list.
                            var itemsLength = items.length;

                            // If there's a limit set and the length of the data and items exceeds that
                            // then we need to trim the data list.
                            if (angular.isDefined(options.params.limit) && (itemsLength + data.length) > options.params.limit) {
                                data = data.splice(0, options.params.limit - itemsLength);
                            }

                            // Update the deferred object with the data list.
                            deferred.update(data);

                            // Concat the items array with the new data.
                            items = items.concat(data);

                            // If we have more pages to load then call this method until we reached the limit/end, otherwise resolve the promise
                            // with the list of items.
                            if (angular.isDefined(response.data.next) && response.data.next !== null && items.length < options.params.limit) {
                                api.getPage(response.data.next, options, deferred, items);
                            } else {
                                deferred.resolve(items);
                            }

                        }, deferred.reject);
                },

                stream: function (url, options) {
                    var deferred = extQ.defer(['update']);
                    var items = [];

                    api.getPage(url, options, deferred, items);

                    return deferred.promise;
                },

                load: function (url, options) {
                    var httpOptions = angular.extend({
                        method: 'GET',
                        url: url
                    }, options);

                    return $http(httpOptions);
                },

                loadList: function (url, options, deferred) {
                    options = angular.extend({}, defaultOptions, options);
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    var cacheUrlKey = formatUrl(url, options.params);
                    var cachedUrls;
                    var addedUrls = [];
                    if (options.cacheItems) {
                        // Load list of item URLs from urlCache.
                        cachedUrls = api.urlCache.get(cacheUrlKey);
                        if (angular.isDefined(options.params.limit) && angular.isDefined(cachedUrls)) {
                            cachedUrls = cachedUrls.splice(0, options.params.limit);
                        }

                        $timeout(function () {
                            angular.forEach(cachedUrls, function (url) {
                                var obj = api.objectCache.get(url);
                                if (angular.isDefined(obj) && addedUrls.indexOf(obj.url) === -1) {
                                    deferred.add(obj);
                                    addedUrls.push(obj.url);
                                }
                            });
                        }, 0);
                    }

                    var seen = {};
                    api.stream(url, options)
                        .update(function (list) {
                            // Stream the list
                            angular.forEach(list, function (item) {
                                seen[item.url] = item;
                                if (options.cacheItems) {
                                    var cached = api.objectCache.get(item.url);

                                    if (angular.isUndefined(cached)) {
                                        api.objectCache.put(item.url, item);
                                        deferred.add(item);
                                        addedUrls.push(item.url);
                                    } else {
                                        if (!angular.equals(cached, item)) {
                                            api.objectCache.put(item.url, item);
                                            deferred.update(item);
                                        } else if (addedUrls.indexOf(item.url) === -1) {
                                            deferred.add(item);
                                            addedUrls.push(item.url);
                                        }
                                    }
                                } else {
                                    deferred.add(item);
                                }
                            });
                        })
                        .then(function (list) {
                            if (options.cacheItems) {
                                // Remove items from the cache if they were not returned
                                // in the list.
                                if (angular.isDefined(cachedUrls)) {
                                    angular.forEach(cachedUrls, function (url) {
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
                                api.urlCache.put(cacheUrlKey, urls);
                            }

                            deferred.resolve(list);
                        });

                    return deferred.promise;
                },

                loadItem: function (url, options, deferred) {
                    options = angular.extend({}, defaultOptions, options);
                    deferred = deferred || extQ.defer(['add', 'update', 'remove']);

                    var cachedObject;
                    if (options.cacheItems) {
                        $timeout(function () {
                            // Load the item from the cache.
                            cachedObject = api.objectCache.get(url);
                            if (angular.isDefined(cachedObject)) {
                                deferred.add(cachedObject);
                            }
                        }, 0);
                    }

                    api.load(url, options).then(function (response) {
                        var item = response.data;
                        if (options.cacheItems) {
                            if (angular.isUndefined(cachedObject)) {
                                api.objectCache.put(url, item);
                                deferred.add(item);
                            } else if (!angular.equals(cachedObject, item)) {
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

                    var cachedObject;
                    if (options.cacheItems) {
                        $timeout(function () {
                            // Load the options from the cache.
                            cachedObject = api.optionsCache.get(url);
                            if (angular.isDefined(cachedObject)) {
                                deferred.resolve({data: cachedObject, url: url});
                            }
                        }, 0);
                    }

                    $http({
                        method: 'OPTIONS',
                        url: url
                    }).then(function (response) {
                        if (options.cacheItems) {
                            if (!angular.equals(cachedObject, response.data)) {
                                api.optionsCache.put(url, response.data);
                            }
                        }

                        deferred.resolve({data: response.data, url: url});
                    }, deferred.reject);

                    return deferred.promise;
                }
            };

            return api;
        }
    ]);
}(window.angular));
