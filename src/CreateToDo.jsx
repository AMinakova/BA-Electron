import React, { useState } from 'react'
import { FormControl, Button } from 'react-bootstrap';
import './App.css';


export default function CreateToDo(props) {
    const [ toDoText, setToDoText] = useState("")

    return <div className="addTodo">
                <h2>ToDo hinzufügen:</h2>
                <FormControl
                    className="inputField" 
                    as="textarea" 
                    aria-label="With textarea" 
                    placeholder="Tipp ToDo ein..."
                    autoFocus
                    onChange={ (e, props) =>{setToDoText(e.target.value)} }/>
                <Button className="button" variant="primary" onClick={() => props.saveToDoItem(toDoText)} >Speichern</Button>{' '}
                <Button className="button" variant="secondary" onClick={props.showItemsList}>Abbrechen</Button>{' '}
            </div>
}