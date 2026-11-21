// base functionality derived hastily from
// https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
// and a little of
// this https://gist.github.com/andjosh/7867934
const dropArea = document.getElementById('drop-area')

dropArea.addEventListener('drop', handleDrop, false)

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
	e.preventDefault()
	e.stopPropagation()
	e.dataTransfer.dropEffect = 'copy'
}

;['dragenter', 'dragover'].forEach(eventName => {
	dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
	dropArea.classList.add('highlight')
}

function unhighlight(e) {
	dropArea.classList.remove('highlight')
}

function handleDrop(e) {
	let dt = e.dataTransfer
	let files = dt.files

	if (
		files[0].type.match('application/json') || // firefox
		files[0].type.match('text/plain')) { // chrome
		handleFiles(files)
	}
}

function handleFiles(files) {
	const file = files[0]
	const reader = new FileReader()

	reader.onload = function(e) {
		const directions = document.getElementById('directions')
		let json
		try {
			json = JSON.parse(e.target.result)
		} catch (err) {
			directions.textContent = `That file isn't valid JSON: ${err.message}`
			return
		}

		// new settings are merged over the old ones, so check the result
		const config = new Config(json)
		config.merge()
		if (!config.json.APIurl && config.json.store != 'local') {
			directions.textContent = 'The config needs an "APIurl", or "store": "local"'
			return
		}

		config.init()
		directions.innerHTML = 'Config loaded, setting up your jars.'
		setTimeout(() => {
			window.location.assign('index.html')
		}, 1200);
	}

	reader.readAsText(file)
}

document.getElementById('template').addEventListener('click', () => {
	// Create an invisible A element
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	a.href = 'assets/downloads/template.json'

	// Use download attribute to set set desired file name
	a.setAttribute("download", 'jars-template.json');

	// Trigger the download by simulating click
	a.click();

	// Cleanup
	document.body.removeChild(a);
})

// download the most current config
document.getElementById('current').addEventListener('click', () => {
	// Create an invisible A element
	const a = document.createElement("a");
	a.style.display = "none";
	document.body.appendChild(a);

	// Set the HREF to a Blob representation of the data to be downloaded
	let obj = JSON.parse(localStorage.getItem('config')) || {}
	a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

	// Use download attribute to set set desired file name
	a.setAttribute("download", 'jars-settings.json');

	// Trigger the download by simulating click
	a.click();

	// Cleanup
	document.body.removeChild(a);
})

// go back home on esc
document.addEventListener('keydown', event => {
	if (event.key === "Escape") {
		window.location.assign('index.html')
	}
})
