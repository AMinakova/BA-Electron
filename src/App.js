import React, {useState} from 'react'
import './App.css';
import Welcome from './Welcome'
import CreateToDo from './CreateToDo'
import ItemsList from './ItemsList'
import ToDoItem from './ToDoItem';

export default function App() {


  var parse = require('csv-parse');
  const [state, setState] = useState(0)
  const [toDoList, setToDoList] = useState([])
  
  const showCreateToDo = () => {
    setState(1);
  }
  const showItemsList = () => {
    setState(2)
  }

  const showOpenedItemsList = (toDoList) => {
    setToDoList(toDoList)
    setState(2)
  }
  const showNotification = () => {
    return new Notification('Erfolg', {
      body: 'ToDo Eintrag ist gespeichert'
  })} 
  
  function saveToDoItem(toDoText) {
    var toDoItem = new ToDoItem(toDoText);
    toDoList.push(toDoItem);
    setToDoList(toDoList);
    //showNotification();
    showItemsList();
  }

  //writeToCSVFile
  function writeToCSVFile() {
    const filename = 'C:/Users/ganna.minakova/Desktop/BachelorArbeit/Electron Todo/react-electron/output.csv';
    const data = [filename, extractAsCSV()]
    window.rpc.reqSync('saveFile', data);
  }
  
  function extractAsCSV() {
    const header = ['Datum', 'Text', 'Done'];
    const rows = toDoList.map(item =>
       `${item.date},${item.text},${item.done}`
    );
    return header.concat(rows).join("\n");
  }
  
  function getPage(state) {
    switch(state) {
      case 0:
        return <Welcome showCreateToDo={showCreateToDo} showOpenedItemsList={showOpenedItemsList}/>;
      case 1:
        return <CreateToDo showItemsList={showItemsList} saveToDoItem={saveToDoItem}/>;
      case 2:
        return <ItemsList toDoList={toDoList} showCreateToDo={showCreateToDo} writeToCSVFile={writeToCSVFile}/>
      default:
        break;
    }
  }

  return (
    <div className="padding">
      {getPage(state)}
    </div>
  );
}

