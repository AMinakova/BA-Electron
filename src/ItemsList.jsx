import React from 'react'
import { Table, Button, InputGroup } from 'react-bootstrap';
import './App.css';

export default function ItemsList(props) {
    

    const smalltalk = require('smalltalk');
    const showPrompt = () => {
        smalltalk
        .prompt('Bennen deine Liste!', 'Tipp Name von deiner Liste:', '10')
        .then((value) => {
            console.log(value);
        })
        .catch(() => {
            console.log('cancel');
        });
    }

    function renderItem(toDoItem, index) {
        return <tr key={index} className='todoItem-data' data-id={index}>
                    <td>{index + 1}</td>
                    <td>{(new Date(toDoItem.date)).toLocaleDateString()}</td>
                    <td>{toDoItem.text}</td>
                </tr>
    }


    return <div>
            <h2>Deine ToDo Liste</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>ToDo</th>
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