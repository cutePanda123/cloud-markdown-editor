const fs = window.require('fs').promises;

const fileHelper = {
    readFile: (path, cb) => {
        return fs.readFile(path, { encoding: 'utf-8' });
    },
    writeFile: (path, content, cb) => {
        return fs.writeFile(path, content, { encoding: 'utf-8' });
    },
    renameFile: (path, newPath) => {
        return fs.rename(path, newPath);
    },
    deleteFile: (path) => {
        return fs.unlink(path);
    }
};

export default fileHelper;
