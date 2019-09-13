/*
	Copyright 2019 Michael Hemingway
	Licensed under the MIT License

	Concepts derived from Google's own demo of a basic SW implementation
*/

// Names of the two caches used in this version of the service worker.
// Bump version number on change of local resources to trigger reinstall.
const RUNTIME = 'jars_runtime_000'

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
	const caches = [RUNTIME]
	event.waitUntil(
		caches.keys().then(cacheNames =>
			Promise.all(
				cacheNames.filter(() => true
					// just deletes all caches
				).map(cacheName => caches.delete(cacheName))
			)
		)
	)
})

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', async event => {
	// Skip cross-origin requests for now
	let response

	if (event.request.url.startsWith(self.location.origin)) {

		let matchedCache = await caches.match(event.request)
		if (matchedCache) response = cachedResponse

		let cache = await caches.open(RUNTIME)

		response = await fetch(event.request)
			.then(response => cache.put(event.request, response.clone()))
			.then(() => response )
	}

	event.respondWith(response)
})
