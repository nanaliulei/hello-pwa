

const PRECACHE = 'sw-preCache';
const RUNTIME = 'runtime';

// every check-in should change this value for refresh cache.
let hash = '12/18:9:12/2019';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => {
            // cache.addAll(sites_v1);
            cache.addAll(persistent_image_v1);
        })
        .then(self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // New service worker upgrade, then delete caches other than whitelist..
    const whiteList = [];  // const whiteList = [PRECACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !whiteList.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        var path = event.request.url;

        if (sites_v1.indexOf(path) !== -1 ||
                persistent_image_v1.indexOf(path) !== -1) {
            // defer checking caches.
            event.respondWith(
                caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then(
                        function(response) {
                          // Check if we received a valid response
                          if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                          } 

                          // IMPORTANT: Clone the response. A response is a stream
                          // and because we want the browser to consume the response
                          // as well as the cache consuming the response, we need
                          // to clone it so we have two streams.
                          var responseToCache = response.clone();

                          caches.open(RUNTIME)
                            .then(function(cache) {
                              cache.put(event.request, responseToCache);
                            });

                          return response;
                        }
                      );

                    // if (FECHED_ON_SW.indexOf(path) !== -1) {
                    //     return caches.open(RUNTIME).then(cache => {
                    //         return fetch(event.request).then(response => {
                    //             return cache.put(event.request, response.clone()).then(() => {
                    //                 console.log("[SW] fetch and return on SW: " + event.request.url);
                    //                 return response;
                    //             });
                    //         });
                    //     });
                    // } else
                    // {
                    //     caches.open(RUNTIME).then(cache => {
                    //         fetch(event.request).then(response => {
                    //             cache.put(event.request, response);
                    //             console.log("[SW] fetch on client and cache on SW: " + event.request.url);
                    //         });
                    //     });
                    //     return new Response(); // null body returns will let client fetch on the client.
                    // }
                })
            );
        }
    }
});

var sites_v1 = [
    "https://sunggook.github.io/hello-pwa/service-worker.js",
    "https://sunggook.github.io/hello-pwa/",
    "https://sunggook.github.io/hello-pwa/script.js",
    "https://sunggook.github.io/hello-pwa/share.js",
    "https://sunggook.github.io/hello-pwa/badging.js",
    "https://sunggook.github.io/hello-pwa/style.css",

   ]

var persistent_image_v1 = [
    "https://sunggook.github.io/hello-pwa/skull192.png",
    "https://sunggook.github.io/hello-pwa/skull512.png",
]