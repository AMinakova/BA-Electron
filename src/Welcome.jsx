import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsArrowsFullscreen } from 'react-icons/bs';

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

  return (
    <div className="welcome">
        <div className="icon" >
            <BsArrowsFullscreen onClick={setFullScreen} title="Vollbildmodus anmachen"/>
        </div>
              
        <div className="welcomeText">
            <h1>Herzlich wilkommen in ToDo App!</h1>
            <br/>Das ist klein App um Liste zu schreiben, speichern und auslesen. Fang an deine erste Liste zu erstellen oder öffne deine Liste und korriegiere sie
        </div>
        <div className="buttonGroup">
            <Button className="button" variant="outline-primary" onClick={props.openFile}>Datei öffnen</Button>
            <Button className="button" variant="primary" onClick= {props.showCreateToDo}>Liste erstellen</Button>
        </div>
    </div>
  );
}
