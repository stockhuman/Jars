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
		let json = JSON.parse(e.target.result)
		new Config(json).init()
		document.getElementById('directions').innerHTML = 'Config loaded, setting up your jars.'
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

const remote = require('electron').remote

const win = remote.getCurrentWindow()

// When document has loaded, initialise
document.onreadystatechange = (event) => {
	if (document.readyState == "complete") {
		handleWindowControls()
	}
}

window.onbeforeunload = (event) => {
	/* If window is reloaded, remove win event listeners
	(DOM element listeners get auto garbage collected but not
	Electron win listeners as the win is not dereferenced unless closed) */
	win.removeAllListeners()
}

function handleWindowControls() {
	// Make minimise/maximise/restore/close buttons work when they are clicked
	document.getElementById('min-button').addEventListener("click", event => {
		win.minimize()
	})

	document.getElementById('max-button').addEventListener("click", event => {
		win.maximize()
	})

	document.getElementById('restore-button').addEventListener("click", event => {
		win.unmaximize()
	})

	document.getElementById('close-button').addEventListener("click", event => {
		win.close()
	})

	// Toggle maximise/restore buttons when maximisation/unmaximisation occurs
	toggleMaxRestoreButtons();
	win.on('maximize', toggleMaxRestoreButtons);
	win.on('unmaximize', toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add('maximized')
		} else {
			document.body.classList.remove('maximized')
		}
	}
}
