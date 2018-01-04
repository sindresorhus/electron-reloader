'use strict';
const electron = require('electron');

require('..')(module, {
	debug: true
});

electron.app.on('ready', () => {
	const win = new electron.BrowserWindow();
	win.loadURL(`file://${__dirname}/index.html`);
});
