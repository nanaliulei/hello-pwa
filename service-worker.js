const runtime_cache_ = 'runtime';
let precache_ = ""

// every check-in should change this value for refresh cache.
let hash = '6/15:9:05/2020';

self.addEventListener('install', (event) => {
    let t = new Date();
    precache_ = "precache_" + t.getTime();
    event.waitUntil(
        caches.open(precache_)
        .then(cache => {
            cache.addAll(sites_v1);
            cache.addAll(persistent_image_v1);
        })
        .then(self.skipWaiting()) // skipWaiting.
    );
});

self.addEventListener('activate', (event) => {
    // New service worker upgrade, then delete caches other than whitelist..

    const whiteList = [precache_];
    event.waitUntil(
        // if (self.registration.navigationPreload) {
        //     await self.registration.navigationPreload.enable();
        // }

        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !whiteList.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim()) // clients.claim()
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        var path = event.request.url;

        // if (sites_v1.indexOf(path) !== -1 ||
        //      persistent_image_v1.indexOf(path) !== -1) {
            // defer checking caches.
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // const preload_response = await event.preloadResponse;
                // if (preload_response) {
                //     storeToCache(preload_response.clone());
                //     return preload_response;
                // }

                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                        // null body returns will let client fetch on the client.
                        return new Response();
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();
                        storeToCache(response.clone());
                        return response;
                    }
                    );
            })
        );

        function storeToCache(response) {
            caches.open(runtime_cache_)
            .then(function(cache) {
                cache.put(event.request, responseToCache);
            });
        }
        // }
    }
});

var sites_v1 = [
    "https://sunggook.github.io/hello-pwa/service-worker.js",
    "https://sunggook.github.io/hello-pwa/",
    "https://sunggook.github.io/hello-pwa/script.js",
    "https://sunggook.github.io/hello-pwa/share.js",
    "https://sunggook.github.io/hello-pwa/badging.js",
    "https://sunggook.github.io/hello-pwa/style.css",
    "https://sunggook.github.io/hello-pwa/related_apps.js",
    "https://sunggook.github.io/hello-pwa/simple-text-reader/filehandler.js",
    "https://sunggook.github.io/hello-pwa/manifest.json",
   ]

var persistent_image_v1 = [
    "https://sunggook.github.io/hello-pwa/skull192.png",
    "https://sunggook.github.io/hello-pwa/skull512.png",
]