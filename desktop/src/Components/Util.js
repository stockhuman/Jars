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
