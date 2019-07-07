const { app, BrowserWindow } = require('electron')

let win = null

const createWindow = () => {
	// Initialize the window to our specified dimensions
	win = new BrowserWindow({ width: 1000, height: 600 })

	// Specify entry point
	win.loadURL('http://localhost:3000')

	// Show dev tools
	// Remove this line before distributing
	win.webContents.openDevTools()

	// Remove window once app is closed
	win.on( 'closed', () => { win = null } )
}

app.on('ready', createWindow)

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
})

app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})
