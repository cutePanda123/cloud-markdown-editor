const { BrowserWindow } = require("electron");

class AppWindow extends BrowserWindow {
  constructor(config, url) {
    const defaultConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
      show: false,
      backgroundColor: '#efefef'
    };
    const finalConfig = {...defaultConfig, ...config};
    super(finalConfig);
    this.loadURL(url);
    this.once('ready-to-show', () => {
        this.show();
    });
  }
};

module.exports = AppWindow;
