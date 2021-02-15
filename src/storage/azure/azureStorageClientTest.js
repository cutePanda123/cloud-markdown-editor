const AzureStorageClient = require('./azureStorageClient');

const azureClient = new AzureStorageClient(
  "REPLACE WITH CONNECTION STRING",
  "FILE-SHARE-NAME",
  "FILE-SHARE-FOLDER-NAME",
  (data) => {
    console.log(data);
  },
  (error) => {
    console.log(error);
  }
);

azureClient.uploadFile(
  "/home/USERNAME/Documents/FILE-NAME.md",
  (data) => {
    console.log(data + "!!!!");
    azureClient.downloadFile(
      "FILE-NAME.md",
      "/home/USERNAME/Documents/OUTPUT-FILE-NAME.md",
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
