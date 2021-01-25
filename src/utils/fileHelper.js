const fs = require('fs').promises;
const path = require('path');

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

const testPath = path.join(__dirname, 'helper.js');
const testWritePath = path.join(__dirname, 'test.txt');
const renamePath = path.join(__dirname, 'test-rename.txt');

fileHelper.readFile(testPath).then((data) => {
    console.log(data);
});

fileHelper.writeFile(testWritePath, 'hello world').then(() => {
    console.log("write success");
});

fileHelper.renameFile(testWritePath, renamePath).then(() => {
    console.log("rename success");
});

fileHelper.deleteFile(renamePath).then(() => {
    console.log("delete success");
});

