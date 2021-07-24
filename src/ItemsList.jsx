import React, { useState } from 'react'
import { Table, Button, InputGroup } from 'react-bootstrap';
import './App.css';

export default function ItemsList(props) {




    function renderItem(toDoItem, index) {
        return <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{(new Date(toDoItem.date)).toLocaleDateString()}</td>
                    <td>{toDoItem.text}</td>
                    <td><InputGroup.Checkbox /></td>
                </tr>
    }


    return <div className="padding">
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>ToDo</th>
                    <th>Done</th>
                    </tr>
                </thead>
                <tbody>
                    {props.toDoList.map(renderItem)}
                </tbody>
            </Table>
            <Button className="button" variant="primary" onClick={props.writeToCSVFile}>Liste speichern</Button>{' '}
            <Button className="button" variant="outline-primary" onClick={props.showCreateToDo}>ToDo hinzufügen</Button>{' '}
        </div>
}