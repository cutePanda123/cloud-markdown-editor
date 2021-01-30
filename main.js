const { app, BrowserWindow, Menu } = require('electron');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const menuTemplate = require('./src/menuTemplate');

Store.initRenderer();

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

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});