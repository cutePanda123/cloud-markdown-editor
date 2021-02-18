const { remote, ipcRenderer } = require("electron");
const Store = require('electron-store');
const settingsStore = new Store({name: 'Settings'});
const azureStorageInputIds = ['#fileShareName', '#fileShareFolderName', '#connectionString'];
const $ = (selector) => {
    const results = document.querySelectorAll(selector);
    return results.length > 1 ? results : results[0];
};

document.addEventListener('DOMContentLoaded', () => {
    let savedLocation = settingsStore.get('savedFileLocation');
    if (savedLocation) {
        $('#saved-file-location').value = savedLocation;
    }
    azureStorageInputIds.forEach(selector => {
        const storeKey = selector.substr(1);
        if (settingsStore.get(storeKey)) {
            $(selector).value = settingsStore.get(storeKey);
        }
    });
    $('#select-new-location').addEventListener('click', () => {
        remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            message: 'Select File Save Location'
        }).then(data => {
            if (!data || !Array.isArray(data.filePaths) || data.filePaths.length == 0) {
                return;
            }
            $('#saved-file-location').value = data.filePaths[0];
            savedLocation = data.filePaths[0];
        });
    });

    $('#settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        azureStorageInputIds.forEach(selector => {
            if ($(selector)) {
                let {id, value} = $(selector);
                settingsStore.set(id, value ? value : '');
            }
        });
        settingsStore.set('savedFileLocation', savedLocation);

        // sent a event to main process to notice that the cloud storage config 
        // was added
        ipcRenderer.send('config-is-saved');
        remote.getCurrentWindow().close();
    });

    $('.nav-tabs').addEventListener('click', (e) => {
        e.preventDefault();
        $('.nav-link').forEach(element => {
            element.classList.remove('active');
        });
        e.target.classList.add('active');
        $('.config-area').forEach(element => {
            element.style.display = 'none';
        });
        $(e.target.dataset.tab).style.display = 'block';
    });
});