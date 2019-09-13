/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */

const setLocaleStrings = async () => {
	window.locale = localStorage.getItem('locale') || 'en'
	window.localeStrings = await fetch(`./locales/${window.locale}.json`)
		.then(data => data.json())
		.catch(async () => {
			console.warn(`⚠️ Jars does not support '${window.locale}' ❌`)
			console.info(`🌐 Jars speaks: EN, FR, DE, JP, IT, ZH. ✅`)
			// if the specified language does not exist, default to english
			return await fetch(`./locales/en.json`).then(data => data.json())
		})
	window.defaultLocaleStrings = await fetch(`./locales/en.json`)
		.then(data => data.json())

	document.dispatchEvent(new CustomEvent('localesReady'))
}

// this class is so built to handle grammatical exceptions,
// where a language's syntax doesn't fit into this prescribed form,
// and so must return something different.
//
// As cases arise, different exports should be created to handle edges
function locales (keys) {

	const w = () => {
		console.warn(`🌐 ${window.localeStrings.noTranslationWarning} '${keys}'`)
	}

	// Falls back to english (or another form of the language if available)
	// for any desired translation chunk
	return window.localeStrings[keys] || (w(), window.defaultLocaleStrings[keys])
}
