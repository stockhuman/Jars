function elem (type, options = {}) {
	let e = document.createElement(type)
	for (property in options) {
		e[property] = options[property]
	}
	return e
}

function elemNS (ns, type) {
	return document.createElementNS(ns, type)
}

function filterFloat(value) {
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
function YYYYMMDD(date = new Date()) {
	return date.toISOString().replace(/-/g, '').slice(0, 8)
}

// returns a date from a 'YYYYMMDD' string
function fromSQL(date) {
	if (!date) return new Date()

	date = String(date)

	return new Date(
		date.substring(0, 4), // year
		Number(date.substring(5, 6)) - 1, // month, zero indexed (???)
		date.substring(7)
	)
}
