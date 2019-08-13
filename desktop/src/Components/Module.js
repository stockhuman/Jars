class Module {
	constructor ({ root = null }) {
		if (this.constructor === Module) {
			throw new TypeError('class "Module" cannot be instantiated directly.')
		}

		if (this.render === undefined) {
			throw new TypeError('Modules must implement a render() method')
		}

		this.state = {}
		this.root = root
	}

	// shim for native non-react code
	setState(props) {
		this.state = { ...this.state, ...props }
		this.render()
	}

	setAttributes(element, attributes) {
		Object.keys(attributes).forEach(name => {
			element.setAttribute(name, attributes[name])
		})
	}
}
