const { app, shell, ipcMain } = require("electron");
const Store = require("electron-store");
const settingsStore = new Store({ name: "Settings" });

const isCloudStorageConfiged = ["accessKey", "secretKey", "bucketName"].every(
  (key) => !!settingsStore.get(key)
);
let enableAutoSync = settingsStore.get("enableAutoSync");
let template = [
  {
    label: "File",
    submenu: [
      {
        label: "New File",
        accelerator: "CmdOrCtrl+N",
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send("create-new-file");
        },
      },
      {
        label: "Save",
        accelerator: "CmdOrCtrl+S",
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send("save-edit-file");
        },
      },
      {
        label: "Search",
        accelerator: "CmdOrCtrl+F",
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send("search-file");
        },
      },
      {
        label: "Open File...",
        accelerator: "CmdOrCtrl+O",
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send("import-file");
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall",
      },
    ],
  },
  {
    label: "Cloud Sync",
    submenu: [
      {
        label: "Configure",
        accelerator: "CmdOrCtrl+,",
        click: () => {
          ipcMain.emit("open-settings-window");
        },
      },
      {
        label: "AutoSync",
        type: "checkbox",
        enabled: isCloudStorageConfiged,
        checked: enableAutoSync,
        click: () => {
          settingsStore.set("enableAutoSync", !enableAutoSync);
        },
      },
      {
        label: "Sync All",
        enabled: isCloudStorageConfiged,
        click: () => {
          ipcMain.emit("upload-all-to-qiniu");
        },
      },
      {
        label: "Download",
        enabled: isCloudStorageConfiged,
        click: () => {},
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Refresh",
        accelerator: "CmdOrCtrl+R",
        click: (item, focusedWindow) => {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        label: "Fullscreen",
        accelerator: (() => {
          if (process.platform === "darwin") return "Ctrl+Command+F";
          else return "F11";
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        },
      },
      {
        label: "DevTool",
        accelerator: (function () {
          if (process.platform === "darwin") return "Alt+Command+I";
          else return "Ctrl+Shift+I";
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) focusedWindow.toggleDevTools();
        },
      },
    ],
  },
  {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close",
      },
    ],
  },
  {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Exploer More",
        click: () => {
          shell.openExternal("http://electron.atom.io");
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: `About ${name}`,
        role: "about",
      },
      {
        type: "separator",
      },
      {
        label: "Configure",
        accelerator: "Command+,",
        click: () => {
          ipcMain.emit("open-settings-window");
        },
      },
      {
        label: "Services",
        role: "services",
        submenu: [],
      },
      {
        type: "separator",
      },
      {
        label: `Hide ${name}`,
        accelerator: "Command+H",
        role: "hide",
      },
      {
        label: "Hide Others",
        accelerator: "Command+Alt+H",
        role: "hideothers",
      },
      {
        label: "Display All",
        role: "unhide",
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  });
} else {
  template[0].submenu.push({
    label: "Configure",
    accelerator: "Ctrl+,",
    click: () => {
      ipcMain.emit("open-settings-window");
    },
  });
}

module.exports = template;
