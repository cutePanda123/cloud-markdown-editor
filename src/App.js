import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './componments/FileSearch';

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col-6 bg-danger left-panel">
          <FileSearch 
            title={'My files'}
            onFileSearch={(value) => {console.log(value)}}
          />
        </div>
        <div className="col-6 bg-primary right-panel">
          <h1>Right panel!!!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
