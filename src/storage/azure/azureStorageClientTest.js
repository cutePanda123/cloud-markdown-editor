const AzureStorageClient = require('./azureStorageClient');

const azureClient = new AzureStorageClient(
  "connection-string",
  "file-share-name",
  "file-folder-name",
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);

azureClient.uploadFile(
  "local-test-file-path",
  (data) => {
    azureClient.downloadFile(
      "test-file-name",
      "loccal-downloaded-file-path",
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
