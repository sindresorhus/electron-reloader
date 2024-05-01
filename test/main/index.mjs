import path from 'node:path';
import {app, BrowserWindow} from 'electron';
import reload from '../../index.js';

reload(import.meta, {
	debug: true,
});

await app.whenReady();

const mainWindow = new BrowserWindow();
await mainWindow.loadFile(path.join(import.meta.dirname, '../index.html'));
