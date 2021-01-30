import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import {
  faPlus,
  faFileImport,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import BottomBtn from "./componments/BottomBtn";
import TabList from "./componments/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { flattenArray, objToArray } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
import useIpcRenderer from "./hooks/useIpcRenderer";
const { join, basename, extname, dirname } = window.require("path");
const { remote, ipcRenderer } = window.require("electron");
const Store = window.require("electron-store");

const fileStore = new Store({
  name: "files-data",
});
const settingsStore = new Store({name: 'Settings'});
const saveFilesToStore = (files) => {
  const fileStoreObj = objToArray(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt,
    };
    return result;
  }, {});
  fileStore.set("files", fileStoreObj);
};

function App() {
  const [files, setFiles] = useState(fileStore.get("files") || {});
  const [activeFileId, setActiveFileId] = useState("");
  const [openedFileIds, setOpenedFileIds] = useState([]);
  const [unsavedFileIds, setUnsavedFileIds] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const savedLocation = settingsStore.get('savedFileLocation') || remote.app.getPath("documents");
  const openedFiles = openedFileIds.map((id) => {
    return files[id];
  });
  const activeFile = files[activeFileId];

  const fileClick = (id) => {
    setActiveFileId(id);
    const currentFile = files[id];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[id], body: value, isLoaded: true };
        setFiles({ ...files, [id]: newFile });
      });
    }
    if (!openedFileIds.includes(id)) {
      setOpenedFileIds([...openedFileIds, id]);
    }
  };
  const tabClick = (id) => {
    setActiveFileId(id);
  };
  const tabClose = (id) => {
    const newOpenedFileIds = openedFileIds.filter((fileId) => fileId !== id);
    setOpenedFileIds(newOpenedFileIds);
    if (id !== activeFileId) {
      return;
    }
    if (newOpenedFileIds.length > 0) {
      setActiveFileId(newOpenedFileIds[0]);
    } else {
      setActiveFileId("");
    }
  };
  const fileChange = (id, value) => {
    if (value === files[id].body) {
      return;
    }
    const modifiedFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: modifiedFile });
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIds([...unsavedFileIds, id]);
    }
  };
  const fileDelete = (id) => {
    if (files[id].isNew) {
      const { [id]: value, ...afterDelete } = files;
      setFiles(afterDelete);
      return;
    }
    fileHelper.deleteFile(files[id].path).then(() => {
      const { [id]: value, ...afterDelete } = files;
      tabClose(id);
      setFiles(afterDelete);
      saveFilesToStore(afterDelete);
    });
  };
  const fileNameUpdate = (id, title, isNew) => {
    const newFilePath = isNew
      ? join(savedLocation, `${title}.md`)
      : join(dirname(files[id].path), `${title}.md`);
    const modifiedFile = {
      ...files[id],
      title: title,
      isNew: false,
      path: newFilePath,
    };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newFilePath, files[id].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      fileHelper.renameFile(files[id].path, newFilePath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  };
  const fileSearch = (keyword) => {
    const newFiles = filesArray.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  };
  const fileCreate = () => {
    const newId = uuidv4();
    const newFile = {
      id: newId,
      title: "",
      body: "## new markdown",
      createdAt: new Date().getTime(),
      isNew: true,
    };
    setFiles({ ...files, [newId]: newFile });
  };
  const fileSave = () => {
    fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
      setUnsavedFileIds(unsavedFileIds.filter((id) => id !== activeFileId));
    });
  };

  const filesImport = () => {
    remote.dialog
      .showOpenDialog({
        tilte: "Select a Markdown file to import",
        properties: ["openFile", "multiSelections"],
        filters: [{ name: "Markdown files", extensions: ["md"] }],
      })
      .then((data) => {
        // filtered out the path that exists in the files store
        if (!data || !data.filePaths) {
          return;
        }
        const { filePaths } = data;
        const unincludedFilePaths = filePaths.filter((path) => {
          const isIncluded = Object.values(files).find((file) => {
            return file.path === path;
          });
          return !isIncluded;
        });

        // build file array with file path
        const importFiles = unincludedFilePaths.map((path, index) => {
          return {
            id: uuidv4(),
            title: basename(path, extname(path)),
            path,
          };
        });

        // build new files object
        const newFiles = { ...files, ...flattenArray(importFiles) };
        setFiles(newFiles);
        saveFilesToStore(newFiles);
        if (importFiles.length > 0) {
          remote.dialog.showMessageBox({
            type: "info",
            title: `Import ${importFiles.length} files successfully`,
            message: `Import ${importFiles.length} files successfully`,
          });
        }
      });
  };

  useIpcRenderer({
    "create-new-file": fileCreate,
    "import-file": filesImport,
    "save-edit-file": fileSave,
  });

  const filesArray = objToArray(files);
  const fileList = searchedFiles.length > 0 ? searchedFiles : filesArray;
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch title={"My files"} onFileSearch={fileSearch} />
          <FileList
            files={fileList}
            onFileClick={fileClick}
            onFileDelete={fileDelete}
            onSaveEdit={fileNameUpdate}
          />
          <div className="row no-gutters button-group">
            <div className="col-6">
              <BottomBtn
                text="New"
                colorClassName="btn-primary"
                iconName={faPlus}
                onBtnClick={fileCreate}
              />
            </div>
            <div className="col-6">
              <BottomBtn
                text="Import"
                colorClassName="btn-success"
                iconName={faFileImport}
                onBtnClick={filesImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && (
            <div className="start-page">
              Please open or create a new Markdown file.
            </div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileId}
                unsavedIds={unsavedFileIds}
                onClickTab={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                options={{
                  minHeight: "515px",
                }}
                onChange={(value) => {
                  fileChange(activeFile.id, value);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
