import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./data/defaultFiles";
import {
  faPlus,
  faFileImport,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import BottomBtn from "./componments/BottomBtn";
import TabList from "./componments/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { flattenArray, objToArray } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
const { join } = window.require("path");
const { remote } = window.require("electron");
const Store = window.require("electron-store");

const fileStore = new Store({
  name: "files-data",
});
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
  fileStore.set('files', fileStoreObj);
};

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {});
  const [activeFileId, setActiveFileId] = useState("");
  const [openedFileIds, setOpenedFileIds] = useState([]);
  const [unsavedFileIds, setUnsavedFileIds] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const savedLocation = remote.app.getPath("documents");
  const openedFiles = openedFileIds.map((id) => {
    return files[id];
  });
  const activeFile = files[activeFileId];

  const fileClick = (id) => {
    setActiveFileId(id);
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
    const modifiedFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: modifiedFile });
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIds([...unsavedFileIds, id]);
    }
  };
  const fileDelete = (id) => {
    fileHelper.deleteFile(files[id].path).then(() => {
      delete files[id];
      tabClose(id);
      setFiles(files);
      saveFilesToStore(files);
    });
  };
  const fileNameUpdate = (id, title, isNew) => {
    const newFilePath = join(savedLocation, `${title}.md`);
    const modifiedFile = { ...files[id], title: title, isNew: false, path: newFilePath };
    const newFiles = {...files, [id]: modifiedFile};
    if (isNew) {
      fileHelper
        .writeFile(newFilePath, files[id].body)
        .then(() => {
          setFiles(newFiles);
          saveFilesToStore(newFiles);
        });
    } else {
      fileHelper
        .renameFile(
          join(savedLocation, `${files[id].title}.md`),
          newFilePath
        )
        .then(() => {
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
    fileHelper
      .writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body)
      .then(() => {
        setUnsavedFileIds(unsavedFileIds.filter((id) => id !== activeFileId));
      });
  };

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
              <BottomBtn
                text="Save"
                colorClassName="btn-primary"
                iconName={faSave}
                onBtnClick={fileSave}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
