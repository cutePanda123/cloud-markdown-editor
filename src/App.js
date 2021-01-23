import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './componments/FileSearch';
import FileList from './componments/FileList';
import defaultFiles from './data/defaultFiles';

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-6 left-panel">
          <FileSearch 
            title={'My files'}
            onFileSearch={(value) => {console.log(value)}}
          />
          <FileList
            files={defaultFiles}
            onFileClick={(id) => {console.log('file click:' + id)}}
            onFileDelete={(id) => {console.log('delete: ' + id)}}
            onSaveEdit={(id, input) => {console.log('save: ' + id + ", " + input)}}
          />
        </div>
        <div className="col-6 right-panel">
          <h1>Right panel!!!</h1>
        </div>
      </div>
    </div>
  );
};



export default App;
