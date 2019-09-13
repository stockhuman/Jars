/*
	Copyright 2019 Michael Hemingway
	Licensed under the MIT License

	Concepts derived from Google's own demo of a basic SW implementation
*/

// Names of the two caches used in this version of the service worker.
// Bump version number on change of local resources to trigger reinstall.
const PRECACHE = 'v1.0.0'
const RUNTIME = 'jars_runtime_000'

// A list of local resources we always want to be cached.
// Comprised of almost all of the assets dir + all components
const PRECACHE_URLS = [
	// markup
	'./index.html',
	'./editor.html',
	'./setup.html',
	// settings page download (rarely changes)
	'./assets/downloads/template.json',
	// out beloved font
	'./assets/fonts/InputSansNarrow-Light.ttf',
	// styles
	'./assets/css/main.css',
	'./assets/css/calendar.css',
	'./assets/css/editor.css',
	'./assets/css/fonts.css',
	'./assets/css/header.css',
	'./assets/css/logform.css',
	'./assets/css/meta.css',
	'./assets/css/visualiser.css',
	// languages
	'./locales/locales.js',
	// main scripts
	'./scripts/main.js',
	'./scripts/setup.js',
	// JS components
	'./Components/Calendar.js',
	'./Components/Config.js',
	'./Components/Editor.js',
	'./Components/Header.js',
	'./Components/Logform.js',
	'./Components/Meta.js',
	'./Components/Module.js',
	'./Components/Util.js',
	'./Components/Visualiser.js',
]

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
	const preCache = async () => {
		const cache = await caches.open(PRECACHE)
		return cache.addAll(PRECACHE_URLS)
	}
	event.waitUntil(preCache())
})

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', async () => {
	const caches = [PRECACHE, RUNTIME]
	const keys = caches.keys()
	const staleCaches = keys.filter(cacheName => !caches.includes(cacheName))
	await Promise.all(staleCaches.map(cacheToDelete => caches.delete(cacheToDelete)))
	self.clients.claim()
})

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', async event => {
	// Skip cross-origin requests, like those for Google Analytics.
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
