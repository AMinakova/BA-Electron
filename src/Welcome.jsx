import Button from 'react-bootstrap/Button';
import './App.css';
import React from 'react'

export default function Welcome(props) {
  
  
  const setFullScreen = () => {
    window.rpc.req('fullScreen');
  }

  const showNotification = () => {
    return new Notification('Title', {
      body: 'Notification from the Renderer Process'
  })} 

  const openDialog = () => {
    const fileNames = window.rpc.reqSync('openFileDialogSync');
    if(fileNames) {
        const toDoList = window.rpc.reqSync('readFile', fileNames[0])
        console.log(toDoList)
    }
    console.log(fileNames)
  }

  return (
    <div className="welcome">
        <div className="welcomeText">
            Herzlich wilkommen in ToDo App!
            Das ist klein App um Liste zu schreiben, speichern und auslesen.
            Fang an deine erste Liste zu erstellen oder öffne deine Liste und korriegiere sie
        </div>
        <div>
            <Button className="button" variant="contained" onClick={openDialog} >Open file</Button>
            <Button className="button" variant="contained" onClick= {props.showCreateToDo}>Create List  </Button>
            
            <Button className="button" variant="contained" onClick={setFullScreen}>Make full screen </Button>
        </div>
    </div>
  );
}
