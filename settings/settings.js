const { remote } = require("electron");
const Store = require('electron-store');
const settingsStore = new Store({name: 'Settings'});
const $ = (id) => {
    return document.getElementById(id);
};

document.addEventListener('DOMContentLoaded', () => {
    let savedLocation = settingsStore.get('savedFileLocation');
    if (savedLocation) {
        $('saved-file-location').value = savedLocation;
    }
    $('select-new-location').addEventListener('click', () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            message: 'Select File Save Location'
        }).then(data => {
            if (!data || !Array.isArray(data.filePaths) || data.filePaths.length == 0) {
                return;
            }
            $('saved-file-location').value = data.filePaths[0];
            savedLocation = data.filePaths[0];
        });
    });

    $('settings-form').addEventListener('submit', () => {
        settingsStore.set('savedFileLocation', savedLocation);
        remote.getCurrentWindow().close();
    });
});