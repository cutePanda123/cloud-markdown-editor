import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./componments/FileSearch";
import FileList from "./componments/FileList";
import defaultFiles from "./data/defaultFiles";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import BottomBtn from "./componments/BottomBtn";

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-6 left-panel">
          <FileSearch
            title={"My files"}
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
          <FileList
            files={defaultFiles}
            onFileClick={(id) => {
              console.log("file click:" + id);
            }}
            onFileDelete={(id) => {
              console.log("delete: " + id);
            }}
            onSaveEdit={(id, input) => {
              console.log("save: " + id + ", " + input);
            }}
          />
          <div className="row no-gutters">
            <div className="col-6">
              <BottomBtn
                text="New"
                colorClassName="btn-primary"
                iconName={faPlus}
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
        <div className="col-6 right-panel">
          <h1>Right panel!!!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
