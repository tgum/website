// Licensed under a CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// http://creativecommons.org/publicdomain/zero/1.0/

(function() {
    let root = "/projects/impostor";

    // Update 'version' if you need to refresh the cache
    var staticCacheName = 'static';
    var version = 'v7::';

    // Store core files in a cache (including a page to display when offline)
    function updateStaticCache() {
        return caches.open(version + staticCacheName)
            .then(function (cache) {
                return cache.addAll([
                    root+'/main.js',
                    root+'/style.css',
                    root+'/words.txt',
                    root+'/tiny.js',
                    root+'/',
                ]);
            });
    };

    self.addEventListener('install', function (event) {
        event.waitUntil(updateStaticCache());
    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys()
                .then(function (keys) {
                    // Remove caches whose name is no longer valid
                    return Promise.all(keys
                        .filter(function (key) {
                          return key.indexOf(version) !== 0;
                        })
                        .map(function (key) {
                          return caches.delete(key);
                        })
                    );
                })
        );
    });

    self.addEventListener('fetch', function (event) {
        var request = event.request;
        // Always fetch non-GET requests from the network
        if (request.method !== 'GET') {
            event.respondWith(
                fetch(request)
                    .catch(function () {
                        return caches.match('offline.html');
                    })
            );
            return;
        }

        event.respondWith(
            fetch(request)
                .then(function (response) {
                    // Stash a copy of this page in the cache
                    var copy = response.clone();
                    caches.open(version + staticCacheName)
                        .then(function (cache) {
                            cache.put(request, copy);
                        });
                    return response;
                })
                .catch(function () {
                    return caches.match(request)
                        .then(function (response) {
                            return response
                        })
                })
        );
 
    });

})();