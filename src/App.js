import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./data/defaultFiles";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import BottomBtn from "./componments/BottomBtn";
import TabList from "./componments/TabList";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFileId, setActiveFileId] = useState("");
  const [openedFileIds, setOpenedFileIds] = useState([]);
  const [unsavedFileIds, setUnsavedFileIds] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const openedFiles = openedFileIds.map((id) => {
    return files.find((file) => file.id === id);
  });
  const activeFile = files.find((file) => file.id === activeFileId);

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
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.body = value;
      }
      return file;
    });
    setFiles(newFiles);
    if (!unsavedFileIds.includes(id)) {
      setUnsavedFileIds([...unsavedFileIds, id]);
    }
  };
  const fileDelete = (id) => {
    const newFiles = files.filter((file) => file.id !== id);
    tabClose(id);
    setFiles(newFiles);
  };
  const fileNameUpdate = (id, title) => {
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.title = title;
        file.isNew = false;
      }
      return file;
    });
    setFiles(newFiles);
  };
  const fileSearch = (keyword) => {
    const newFiles = files.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  };
  const fileCreate = () => {
    const newFiles = [
      ...files,
      {
        id: uuidv4(),
        title: "",
        body: "## new markdown",
        createdAt: new Date().getTime(),
        isNew: true,
      },
    ];
    setFiles(newFiles);
  };
  const fileList = searchedFiles.length > 0 ? searchedFiles : files;
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
