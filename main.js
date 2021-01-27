const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    const endpoint = isDev ? "http://localhost:3000" : 'dummyURL';
    mainWindow.loadURL(endpoint);
});