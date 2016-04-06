# Upcoming

* Upgrade Angular compatibility to include 1.3, 1.4, and 1.5.
* Upgrade angular-ext-q to version 1.1.0

# 4.0.3

* Remove cache from `loadOptions`. The cache stopped the response from the server
 being resolved.

# 4.0.2

* Bump angular-cache dependency

# 4.0.1

* Update the main property in `bower.json`.

# 4.0.0

* The `verifyIntegrity` option in angular-cache is now false by default
  due to the major performance issues it imposes.
* `cacheOptions` and `defaultOptions` can now be configured in the drfConfigProvider
  The custom options will be merged with the default set in djangular-rest-framework.

# 3.1.0

* Added config provider.
* Added cacheEnabled option to config provider.
* `drf.loadItem` and `drf.loadList` now reject the deferred object on errors.

# 3.0.1

* Fix destructive update of `options.params.limit`

# 3.0.0

* All `$http` calls now extend the options object. This will result in all
  `$http` requests having `cache: true` by default.
* `options.cache` has been renamed to `options.cacheItems` so to not conflict
  with `options.cache` on `$http`.

# 2.0.1

* An empty params object has been added to the `defaultOptions`.
* `loadList` now keeps track of urls that have been resolved with
  `deferred.add` so that if an object that was in the cache but not
  in the urlCache will now be added.

# 2.0.0

* Moved main file to `./src`.
* Cached items are now updated with `deferred.add` asynchronously.
* `options.params` are now added to the url that's used as the cache key.
* `options.limit` has been deprecated in favour of `options.params.limit`.

# 1.2.4

* Improve dependency matching in `bower.json` to reduce conflicts.

# 1.2.3

* loadOptions should always return the promise object.

# 1.2.2

* When extending defaultOptions specify an empty object as the destination,
  otherwise the defaultOptions object will change as it is specified as the
  destination.

# 1.2.1

* loadOptions response had the url property removed in 1.2.0, this adds it back.

# 1.2.0

* Add option to turn off usage of cache.
* Adjusted response of loadOptions method.

# 1.1.0

* Now handles paginated responses.

# 1.0.2

* Set a default options object and promise if they are not defined.

# 1.0.1

* Fix broken function call.
* CamelCase the module name.

# 1.0.0

* Initial release.
