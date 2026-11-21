// Runs tests/index.html in a hidden Electron window and prints the results.
// Usage: npm test
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

// a throwaway profile, so the tests' localStorage never touches the app's.
// Cleared at the start of each run: Chromium still writes to it while quitting.
const profile = path.join(os.tmpdir(), 'jars-tests')
fs.rmSync(profile, { recursive: true, force: true })
app.setPath('userData', profile)

ipcMain.on('test-result', (event, { title, error }) => {
	console.log(error ? `  ✗ ${title}\n      ${error}` : `  ✓ ${title}`)
})

ipcMain.on('tests-done', (event, failures) => {
	console.log(failures ? `\n${failures} failing` : '\nall passing')
	app.exit(failures ? 1 : 0)
})

app.whenReady().then(() => {
	const win = new BrowserWindow({
		show: false,
		webPreferences: { nodeIntegration: true, contextIsolation: false },
	})
	win.webContents.on('console-message', (event, level, message) => {
		if (level >= 3) console.error(`  [page error] ${message}`)
	})
	win.loadFile(path.join(__dirname, 'index.html'))
})
