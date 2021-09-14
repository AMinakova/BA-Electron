import React from 'react'
import { Table, Button } from 'react-bootstrap';
import '../styles/App.css';

export default function ItemsList(props) {
    

    const smalltalk = require('smalltalk');
    const showPrompt = () => {
        smalltalk
            .prompt('Bennen deine Liste!', 'Tipp Name von deiner Liste:', 'Meine Liste')
            .then((value) => {
                props.saveFile && props.saveFile(value)
            })
            .catch(() => { });
    }

    const renderItem = (toDoItem, index) =>
        <tr key={index} className='todoItem-data' data-id={index}>
            <td>{index + 1}</td>
            <td>{toDoItem.date.toLocaleDateString('de-DE', { dateStyle: 'medium' })}</td>
            <td>{toDoItem.text}</td>
        </tr>


    return <div>
            <h2>Deine ToDo Liste</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Datum</th>
                        <th>Aufgabe</th>
                    </tr>
                </thead>
                <tbody>
                    {props.toDoList.map(renderItem)}
                </tbody>
            </Table>
            <Button className="button" variant="primary" onClick={showPrompt}>Liste speichern</Button>{' '}
            <Button className="button" variant="outline-primary" onClick={props.showCreateToDo}>ToDo hinzufügen</Button>{' '}
        </div>
}