import React, {useEffect, useState} from 'react'
import './App.css';
import Welcome from './Welcome'
import CreateToDo from './CreateToDo'
import ItemsList from './ItemsList'
import ToDoItem from './ToDoItem';

export default function App() {
  var parse = require('csv-parse');
  const [state, setState] = useState(0)
  const [toDoList, setToDoList] = useState([])

  useEffect(() => {
    function ctxMenuHandler(event) {
      event.preventDefault()
      const dataEl = event.target.closest('.todoItem-data')
      if (dataEl) { // todo item record in grid
        const id = dataEl.dataset.id;
        window.rpc.req('showTodoItemContextMenu', id)
      }
      else {
        window.rpc.req('showGlobalContextMenu')
      }
    }

    window.addEventListener('contextmenu', ctxMenuHandler)

    return () => window.removeEventListener('contextmenu', ctxMenuHandler)
  }, []);
  
  useEffect(() => {
    window.rpc.bind('deleteTodoItem', deleteItem);
    return () => window.rpc.unbindAll('deleteTodoItem');
  })
  
  useEffect(() => {
    window.rpc.bind('startOpenFile', openFileWithDialog);
    return () => window.rpc.unbindAll('startOpenFile');
  })

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

  function deleteItem(idStr) {
    const todoId = +idStr;
    setToDoList(prevTodos => prevTodos.filter((_el, arrIdx) => arrIdx !== todoId))
  }

  const showNotification = () => {
    return new Notification('Erfolg', {
      body: 'ToDo Eintrag ist gespeichert'
  })}

  function openFileWithDialog() {
    const fileNames = window.rpc.reqSync('openFileDialogSync');
    if (fileNames) {
      const toDoList = window.rpc.reqSync("readFile", fileNames[0]);
      showOpenedItemsList(toDoList);
    }
  }
  
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
        return <Welcome showCreateToDo={showCreateToDo} openFile={openFileWithDialog} />;
      case 1:
        return <CreateToDo showItemsList={showItemsList} saveToDoItem={saveToDoItem} />;
      case 2:
        return <ItemsList toDoList={toDoList} showCreateToDo={showCreateToDo} writeToCSVFile={writeToCSVFile} />
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

