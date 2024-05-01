# Testing

The tests are manual as I have no idea how to automate this.

From the root directory, run `npm start`, and then edit `index.html` or `main/index.mjs` to see the app restart.

Note: since an ES module has no module graph, main process files cannot be distinguished from renderer files, so any file change restarts the app.
