const azure = require("azure-storage");
const fs = require("fs");
const path = require("path");

class AzureStorageClient {
  constructor(
    connectionString,
    fileShareName,
    fileShareFolderName,
    successCallback,
    errorCallback
  ) {
    this.fileShareFolderName = fileShareFolderName;
    this.fileShareName = fileShareName;
    try {
      this.fileService = azure.createFileService(connectionString);
      this.fileService.createShareIfNotExists(
        this.fileShareName,
        (error, result, response) => {
          if (error) {
            errorCallback && errorCallback(error);
          } else {
            this.fileService.createDirectoryIfNotExists(
              this.fileShareName,
              this.fileShareFolderName,
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
      );
    } catch (error) {
      errorCallback && errorCallback(error);
      return;
    }
  }

  uploadFile(filePath) {
    const cloudFileName = path.parse(filePath).base;
    return new Promise((resolve, reject) => {
      this.fileService.createFileFromLocalFile(
        this.fileShareName,
        this.fileShareFolderName,
        cloudFileName,
        filePath,
        this.handleCallback(resolve, reject)
      );
    });
  }

  downloadFile(cloudFileName, localFilePath, successCallback, errorCallback) {
    this.fileService.getFileToStream(
      this.fileShareName,
      this.fileShareFolderName,
      cloudFileName,
      fs.createWriteStream(localFilePath),
      (error, result, response) => {
        if (error) {
          errorCallback && errorCallback(error);
        } else {
          successCallback && successCallback(result);
        }
      }
    );
  }

  isExistingFile(fileName) {
    return new Promise((resolve, reject) => {
      this.fileService.getFileProperties(
        this.fileShareName,
        this.fileShareFolderName,
        fileName,
        this.handleCallback(resolve, reject)
      );
    });
  }

  handleCallback(resolve, reject) {
    return (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
  }
}

module.exports = AzureStorageClient;
