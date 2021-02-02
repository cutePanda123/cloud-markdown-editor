const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const Store = require("electron-store");
const menuTemplate = require("./src/menuTemplate");
const AppWindow = require("./src/AppWindow");
const path = require("path");

Store.initRenderer();

let mainWindow, settingsWindow;

app.on("ready", () => {
  autoUpdater.autoDownload = false;
  if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, "dev-app-update.yml");
    autoUpdater.checkForUpdates();
  } else {
    autoUpdater.checkForUpdatesAndNotify();
  }

  autoUpdater.on("error", (error) => {
    dialog.showErrorBox(
      "Error",
      error == null ? "unknown" : (error.stack || error).toString()
    );
  });
  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...");
  });
  autoUpdater.on("update-available", () => {
    dialog.showMessageBox(
      {
        type: "info",
        title: "New version available",
        message: "Find a new version, do you want to update?",
        buttons: ["Yes", "No"],
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate();
        }
      }
    );
  });
  autoUpdater.on("update-not-available", () => {
    dialog.showMessageBox({
      title: "No new version available",
      message: "The current version is the latest",
    });
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let logMessage = "Download speed: " + progressObj.bytesPerSecond;
    logMessage = logMessage + " - Download " + progressObj.percent + "%";
    logMessage =
      logMessage +
      "(" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    console.log(logMessage);
  });
  autoUpdater.on("update-download", () => {
    dialog.showMessageBox(
      {
        title: "Finished update",
        message:
          "FInished download, please restart the app to finish the install",
      },
      () => {
        setImmediate(() => autoUpdater.quitAndInstall());
      }
    );
  });

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
    : `file://${path.join(__dirname, "./index.html")}`;
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
