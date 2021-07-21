import Button from '@material-ui/core/Button'
import './App.css';

function App() {
  
  const setFullScreen = () => {
    var electron = require('electron');
    var window = electron.remote.getCurrentWindow();
    window.maximize();
  }

  return (
    <div className="welcome">
        <div className="welcomeText">
            Herzlich wilkommen in ToDo App!
            Das ist klein App um Liste zu schreiben, speichern und auslesen.
            Fang an deine erste Liste zu erstellen oder öffne deine Liste und korriegiere es
        </div>
        <div>
            <Button className="button" variant="contained" >Open file</Button>
            <Button className="button" variant="contained">Create List </Button>
            
            <Button className="button" variant="contained" onClick={setFullScreen}>Make full screen </Button>

            

        </div>
    </div>
  );
}

export default App;
