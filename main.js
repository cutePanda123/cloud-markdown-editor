const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const Store = require("electron-store");
const menuTemplate = require("./src/menuTemplate");
const AppWindow = require("./src/AppWindow");
const path = require("path");

Store.initRenderer();

let mainWindow, settingsWindow;

app.on("ready", () => {
  const mainWindowConfig = {
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  };

  const endpoint = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "./build/index.html")}`;
  mainWindow = new AppWindow(mainWindowConfig, endpoint);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // hook up main events
  ipcMain.on("open-settings-window", () => {
    const settingsWindowConfig = {
      width: 500,
      height: 400,
      parent: mainWindow,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
      },
    };
    const settingsEndpoint = `file://${path.join(
      __dirname,
      "./settings/settings.html"
    )}`;
    settingsWindow = new AppWindow(settingsWindowConfig, settingsEndpoint);
    settingsWindow.on("closed", () => {
      settingsWindow = null;
    });
  });

  // setup menu context
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
