
// check for setup credentials, no redirect
new Config().pollute()
window.storage = new StorageHandler()
if (!window.localeStrings) setLocaleStrings()

let querymodule
let vis

// Await strings before building UI
document.addEventListener('localesReady', () => {
	vis = new Visualiser({ root: document.getElementById('vis-root'), scale: 0 })
	querymodule = new Query({ root: document.getElementById('query-root') })
})

// listen for Q requests made by query module
document.addEventListener('query-request', ({ detail }) => {
	console.log('query request', window.api + detail)
	vis.setQuery(detail) // triggers re-render and response data
})

// feeds response data to querymodule
document.addEventListener('query-response', ({ detail }) => {
	console.log('query response', detail)
	querymodule.setData(detail)
})

document.addEventListener('keyup', event => {
	if (event.key === 'Escape') {
		window.location.href = 'index.html'
	}
})
