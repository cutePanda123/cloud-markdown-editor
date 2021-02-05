const azure = require("azure-storage");
const fs = require("fs");

const fileService = azure.createFileService(
  "CONNECTION_STRING"
);

fileService.createShareIfNotExists(
  "taskshare",
  function (error, result, response) {
    if (!error) {
      console.log(result);
      console.log(response);
    }
  }
);

fileService.createDirectoryIfNotExists(
  "taskshare",
  "taskdirectory",
  function (error, result, response) {
    if (!error) {
      console.log(response);
      console.log(result);
    }
  }
);

fileService.createFileFromLocalFile(
  "taskshare",
  "taskdirectory",
  "taskfile",
  "/home/hadoop/Documents/xyz.md",
  function (error, result, response) {
    if (!error) {
      console.log(result);
      console.log(response);
    } else {
      console.log(error);
    }
  }
);

fileService.getFileToStream(
  "taskshare",
  "taskdirectory",
  "taskfile",
  fs.createWriteStream(
    "/home/hadoop/Codes/cloud-markdown-editor/src/storage/output.md"
  ),
  function (error, result, response) {
    if (!error) {
      // file retrieved
    }
  }
);
