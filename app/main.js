const { app, BrowserWindow } = require('electron');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    minWidth: 500,
    minHeight: 300
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
});
