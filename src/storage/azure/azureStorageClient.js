const azure = require("azure-storage");
const fs = require("fs");
const path = require("path");

class AzureStorageClient {
  constructor(
    connectinString,
    fileShareName,
    fileShareFolderName,
    errorCallback,
    successCallback
  ) {
    this.fileShareFolderName = fileShareFolderName;
    this.fileShareName = fileShareName;
    this.fileService = azure.createFileService(connectinString);
    this.fileService.createShareIfNotExists(
      this.fileShareName,
      function (error, result, response) {
        if (!error) {
          errorCallback && errorCallback(error);
        } else {
          successCallback && successCallback(result);
        }
      }
    );

    this.fileService.createDirectoryIfNotExists(
      this.fileShareName,
      this.fileShareFolderName,
      function (error, result, response) {
        if (!error) {
          errorCallback(error);
        } else {
          successCallback(result);
        }
      }
    );
  }

  uploadFile(filePath, successCallback, errorCallback) {
    const fileName = path.parse(filePath).base;
    console.log(fileName);
    this.fileService.createFileFromLocalFile(
      this.fileShareName,
      this.fileShareFolderName,
      fileName,
      filePath,
      function (error, result, response) {
        if (error) {
          errorCallback && errorCallback(error);
        } else {
          successCallback && successCallback(result);
        }
      }
    );
  }

  downloadFile(cloudFileName, localFilePath, successCallback, errorCallback) {
    this.fileService.getFileToStream(
      this.fileShareName,
      this.fileShareFolderName,
      cloudFileName,
      fs.createWriteStream(localFilePath),
      function (error, result, response) {
        if (error) {
          errorCallback && errorCallback(error);
        } else {
          successCallback && successCallback(result);
        }
      }
    );
  }
}

module.exports = AzureStorageClient;
