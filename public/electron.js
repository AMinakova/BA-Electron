const path = require('path');

const { app, BrowserWindow, Menu, Tray, Notification, ipcMain, dialog } = require('electron');

const NOTIFICATION_TITLE = 'This is Electron Notification'
const NOTIFICATION_BODY = 'Main Process in Electron started'

const isDev = require('electron-is-dev');
const fs = require('fs');
const csv = require('csv-parser'); 
let tray = null
let mainWin = null



function createWindow() {
  // Create the browser window.
  const win = mainWin = new BrowserWindow({
    width: 650,
    height: 500,
    icon: "extraResources/favicon.ico",
    webPreferences: {
      // nodeIntegration: false,
      // enableRemoteModule: false,
      // contextIsolation: true,
      preload: path.join(app.getAppPath(), isDev ? 'public' : '', 'preload.js'),
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
//add icon in tray
  tray = new Tray('C:/Users/ganna.minakova/Desktop/BachelorArbeit/Electron Todo/react-electron/public/favicon.ico')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => {
      win.maximize();
      win.setAlwaysOnTop(true);
    } },
    { label: 'Quit', click: () => {
      app.isQuiting = true;
      app.quit(); 
    } },
  ])

  tray.setToolTip('ToDo')
  tray.setContextMenu(contextMenu)
  tray.on('right-click', () => {
    tray.popUpContextMenu();
  })
  tray.on('click', () => {
    win.maximize();
    win.setAlwaysOnTop(true);
    // restore overlay icon when going back from tray
    //setOverlayIcon(currentOverlayIcon);
  });

}

function showNotification () {
  // new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow).then(showNotification);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('openFileDialogSync', (event, args) => {
  event.returnValue = dialog.showOpenDialogSync()
})

ipcMain.on('fullScreen', (event, args) => {
  mainWin.fullScreen = !mainWin.fullScreen;
})

ipcMain.on('saveFile', (event, args) => {
  console.log(args)
  fs.appendFile(args[0], args[1], (err) => {
    if (err) {
      console.log(err);
    }})
  event.returnValue = true
})
ipcMain.on('readFile', (event, args) => {
  const toDoList = []
  console.log(args)
  fs.createReadStream(args)
  .pipe(csv())
  .on('data', function (row) {
    // console.log('some data')
    // console.log("hier schould be row ------>", row)
    const toDoItem = {
        date: row.Datum,
        text: row.Text,
        done: row.Done
    }
    // console.log("hier schould be todoitem ------>", toDoItem)
    toDoList.push(toDoItem)
  })
  .on('end', function () {
    console.log("hier schould be todolist ------>")//, toDoList)
    console.table(toDoList)
    event.returnValue = toDoList
      
      // TODO: SAVE users data to another file
    })
  .on('error', () => event.returnValue = false)
  // event.returnValue = false
})
