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
