// creates an element and assigns properties. convenience method
function elem (type, options = {}) {
	let e = document.createElement(type)
	for (property in options) {
		e[property] = options[property]
	}
	return e
}

// as above, but for SVG
function elemNS (ns, type, options = {}) {
	let e = document.createElementNS(ns, type)
	for (property in options) {
		e.setAttributeNS(null, property, options[property])
	}
	return e
}

function filterFloat(value) {
	if (!value) return NaN; else value = String(value)
	if (value.startsWith('.')) value = '0' + value
	if ((/^(\|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/).test(value)) {
		return Number(value)
	} else {
		return NaN
	}
}

/**
 * Returns true if string matches 00:00:00 format
 * @since v.2.1.5
 * @param {String} string timestamp to be checked
 */
function TODfromTimestamp(timestamp, hours, locale) {
	let tsParts = timestamp.split(':')
	let h = Number(tsParts[0]) // hour component of timestamp, 24hr time
	let m = Number(tsParts[1]) // minute component

	h += (m / 60) // convert minutes to hour fraction (ex 5.6 hrs) and add
	h -= Number(hours) / 2 // Approximate time of work from point of commit

	// assure commits done in the early morning don't return impossible times
	h = (h % 24).toFixed(2)

	switch (true) {
		case h <= 4: return locale.values[6].abbr // well past sundown
		case h <= 6: return locale.values[0].abbr // in the early morning
		case h <= 11: return locale.values[1].abbr // in the morning
		case h <= 13: return locale.values[2].abbr // around midday
		case h <= 16: return locale.values[3].abbr // in the afternoon
		case h <= 20: return locale.values[4].abbr // in the evening
		case h <= 24: return locale.values[4].abbr // around nighttime
	}
}

/**
 * Returns true if string matches 00:00:00 format
 * @since v.2.1.5
 * @param {String} string timestamp to be checked
 */
function isTimestamp (string) {
	if (string.match(/(\d{2}:){2}\d{2}/g)) return true
	else return false
}

/**
 * Returns a number representing a YYYY-MM-DD date
 * @since v.2.0.1
 * @param {Date} date date to be operated upon, or now
 */
function YYYYMMDD(date) {
	if (date && isValidAPIDate(date)) return date // date is already formatted
	if (!(date instanceof Date)) date = new Date()

	// FR-CA returns a very useful YYYY-MM-DD string with local timezone
	return date.toLocaleString('fr-ca').replace(/-/g, '').slice(0, 8)
}

// returns a date from a 'YYYYMMDD' string
function fromSQL(date) {
	if (!date) return new Date()

	date = date.toString()

	return new Date(
		date.substring(0, 4), // year
		Number(date.substring(4, 6)) - 1, // month, zero indexed (???)
		date.substring(6, 8)
	)
}

// returns true if date is a valid YYYYMMDD int
function isValidAPIDate(date) {
	if (!date) return false
	if (date instanceof Date) return false

	let d = date.toString()
	if (d.length !== 8) return false

	let year = Number(d.substring(0, 4))
	// Jars cannot log productivity before year zero
	if (year >= 0 && year <= 9999) {
		let month = Number(d.substring(4, 6))
		if (month > 0 && month < 13) {
			let day = Number(d.substring(6, 8))
			if (day > 0 && day < 32) {
				// it's a valid date, within reason.
				return true
			} else return false
		} else return false
	} else return false
}
