const prompt = require("prompt-sync")();
const AzureStorageClient = require("./azureStorageClient");

const connectionString = prompt("Enter Azure Storage connection string:");
const fileShareName = prompt("Enter Azure Storage file share name:");
const fileFolderName = prompt("Enter Azure Storage file share folder name:");
const fileName = prompt("Enter target file name:");
const localFilePath = prompt("Enter the local file path that you want to upload:");
const localFileDownloadPath = prompt("Enter the local file path that you want to save the downloaded files:");

const azureClient = new AzureStorageClient(
  connectionString,
  fileShareName,
  fileFolderName,
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);

azureClient.uploadFile(localFilePath).then(
  (res) => {
    azureClient.downloadFile(
      fileName,
      localFileDownloadPath,
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  },
  (error) => {
    console.log(error);
  }
);

azureClient.isExistingFile(fileName).then(
  (res) => {
    console.log("file exists");
    console.log(res);
  },
  (err) => {
    console.log("file does not exist");
    console.log(err);
  }
);
