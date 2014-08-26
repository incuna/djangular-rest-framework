# 2.0.0

* Moved main file to `./src`.
* Cached items are now updated with `deferred.add` asynchronously.

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
