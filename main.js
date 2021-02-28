const { app, Menu, ipcMain, dialog } = require("electron");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const Store = require("electron-store");
const menuTemplate = require("./src/menuTemplate");
const AppWindow = require("./src/AppWindow");
const path = require("path");
const { AzureStorageClient } = require("./src/storage/azure");
Store.initRenderer();

let mainWindow, settingsWindow;
const settingsStore = new Store({ name: "Settings" });
const fileStore = new Store({
  name: "files-data",
});

const createAzureStorageClient = (successCallback, errorCallback) => {
  const fileShareName = settingsStore.get("fileShareName");
  const fileShareFolderName = settingsStore.get("fileShareFolderName");
  const connectionString = settingsStore.get("connectionString");

  return new AzureStorageClient(
    connectionString,
    fileShareName,
    fileShareFolderName,
    successCallback,
    errorCallback
  );
};

app.on("ready", () => {
  autoUpdater.autoDownload = false;
  if (isDev) {
    // uncomment this to local test your auto-update functionality
    //autoUpdater.updateConfigPath = path.join(__dirname, "dev-app-update.yml");
    //autoUpdater.checkForUpdates();
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

  // setup menu context
  let menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

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
    settingsWindow.removeMenu();
    settingsWindow.on("closed", () => {
      settingsWindow = null;
    });
  });

  ipcMain.on("download-file", (event, data) => {
    try {
      const logFun = (data) => {
        console.log(data);
      };
      const storageClient = createAzureStorageClient(logFun, logFun);
      const fileObjs = fileStore.get("files");
      const { key, path, id } = data;
      storageClient.isExistingFile(data.key).then(
        (res) => {
          console.log(res);
          const serverFileUpdatedTime = new Date(res.lastModified).getTime();
          const localFileUpdatedTime = fileObjs[id].updatedAt;
          if (
            !localFileUpdatedTime ||
            serverFileUpdatedTime > localFileUpdatedTime
          ) {
            mainWindow.webContents.send("file-downloaded", {
              status: "download-success",
              id,
            });
          } else {
            mainWindow.webContents.send("file-downloaded", {
              status: "no-new-file",
              id,
            });
          }
        },
        (err) => {
          console.log(err);
          mainWindow.webContents.send("file-downloaded", {
            status: "no-file",
            id,
          });
        }
      );
    } catch (error) {
      logFun(error);
    }
  });

  ipcMain.on("upload-all", () => {
    mainWindow.webContents.send("loading-status", true);
    const fileObjs = fileStore.get("files") || {};
    const logCallback = (data) => {
      console.log(data);
    };
    let storageClient;
    try {
      storageClient = createAzureStorageClient(logCallback, logCallback);
    } catch (error) {
      logCallback(error);
      dialog.showErrorBox(
        "Upload failed",
        "Please check cloud storage config information"
      );
      return;
    }
    const uploadPromiseArray = Object.keys(fileObjs).map((key) => {
      const file = fileObjs[key];
      return storageClient.uploadFile(file.path);
    });
    Promise.all(uploadPromiseArray)
      .then((res) => {
        logCallback(res);
        dialog.showMessageBox({
          type: "info",
          title: `Uploaded ${uploadPromiseArray.length} files`,
          message: `Uploaded ${uploadPromiseArray.length} files`,
        });
        mainWindow.webContents.send("files-uploaded");
      })
      .catch(() => {
        logCallback(error);
        dialog.showErrorBox(
          "Upload failed",
          "Please check cloud storage config information"
        );
      })
      .finally(() => {
        mainWindow.webContents.send("loading-status", false);
      });
  });

  ipcMain.on("config-is-saved", () => {
    // the menu index is different from mac os to windows os
    let cloudOperationsMenu =
      process.platform == "darwin" ? menu.items[3] : menu.items[2];
    const switchItems = (toggle) => {
      [1, 2, 3].forEach((index) => {
        cloudOperationsMenu.submenu.items[index].enabled = toggle;
      });
    };
    const isCloudStorageConfiged = [
      "fileShareName",
      "fileShareFolderName",
      "connectionString",
    ].every((key) => !!settingsStore.get(key));
    if (isCloudStorageConfiged) {
      switchItems(true);
    } else {
      switchItems(false);
    }
  });
  ipcMain.on("upload-file", (event, data) => {
    const successCallback = (result) => {
      console.log("Upload finished", result);
      mainWindow.webContents.send("file-uploaded");
    };
    const errorCallback = (error) => {
      console.log(error);
      dialog.showErrorBox(
        "Upload failed",
        "Please check storage config info or network connectivity"
      );
    };
    try {
      const storageClient = createAzureStorageClient(
        successCallback,
        errorCallback
      );
      storageClient.uploadFile(data.path, successCallback, errorCallback);
    } catch (error) {
      errorCallback(error);
    }
  });
});
