import path from 'node:path';
import {app, BrowserWindow} from 'electron';
import reload from '../../index.js';

reload(import.meta, {
	debug: true,
});

// A top-level `await app.whenReady()` never resolves in the entry file, as the `ready` event fires after the entry file finishes loading.
app.on('ready', async () => {
	const mainWindow = new BrowserWindow();
	await mainWindow.loadFile(path.join(import.meta.dirname, '../index.html'));
});
