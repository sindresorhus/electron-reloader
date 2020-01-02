'use strict';
const path = require('path');
const {app, BrowserWindow} = require('electron');

require('../..')(module, {
	debug: true
});

let mainWindow;

(async () => {
	await app.whenReady();

	mainWindow = new BrowserWindow();
	await mainWindow.loadFile(path.join(__dirname, '../index.html'));
})();
