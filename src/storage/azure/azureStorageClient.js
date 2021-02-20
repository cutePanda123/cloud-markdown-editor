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

  uploadFile(filePath, successCallback, errorCallback) {
    const cloudFileName = path.parse(filePath).base;
    //console.log(fileName);
    this.fileService.createFileFromLocalFile(
      this.fileShareName,
      this.fileShareFolderName,
      cloudFileName,
      filePath,
      (error, result, response) => {
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
      (error, result, response) => {
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
