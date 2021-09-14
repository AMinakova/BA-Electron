const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, Menu, Tray, Notification, ipcMain, dialog } = require('electron');

const isDev = require('electron-is-dev');
const csv = require('csv-parser'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const NOTIFICATION_TITLE = 'This is Electron Notification'
const NOTIFICATION_BODY = 'Main Process in Electron started'

let tray = null
let mainWin = null


function createWindow() {
  // Create the browser window.
  const win = mainWin = new BrowserWindow({
    width: 650,
    height: 450,
    icon: path.join(__dirname, '../extraResources/favicon.ico'),
    webPreferences: {
      // nodeIntegration: false,
      // enableRemoteModule: false,
      // contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
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
  tray = new Tray(path.join(__dirname, '../extraResources/favicon.ico'))
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
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

function setMainMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'Ctrl + F1',
          click() {
            mainWin.webContents.send('startOpenFile');
          }
        },
        { type: 'separator' },
        { role: 'reload', accelerator: 'F5' },
        { role: 'forceReload' },
        {
          label: 'Restart',
          accelerator: 'Ctrl + F9',
          click() {
            app.relaunch();
            app.quit();
          },
        },
        { role: 'quit', accelerator: 'Ctrl + F2', },
      ]
    },
    { role: 'editMenu' },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow).then(setMainMenu).then(showNotification);

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

ipcMain.on('showGlobalContextMenu', (event) => {
  const template = [
    { label: 'Global Menu Item 1 (no action)', },
    { type: 'separator' },
    {
      label: 'Open File',
      click() {
        event.sender.send('startOpenFile');
      },
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})

ipcMain.on('showTodoItemContextMenu', (event, itemId) => {
  const template = [
    { label: 'Hier ist das Todo Kontext-Menu:' },
    { type: 'separator' },
    {
      label: 'Das Todo löschen',
      click() {
        event.sender.send('deleteTodoItem', itemId)
      },
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(BrowserWindow.fromWebContents(event.sender))
})

ipcMain.on('fullScreen', (event, args) => {
  mainWin.fullScreen = !mainWin.fullScreen;
})

ipcMain.on('openFileDialogSync', (event, args) => {
  const options = { 
    title: "Öffne .csv Datei",
    filters: [{
      name: ".csv Files",
      extensions: ["csv"]
    }]
  }
  event.returnValue = dialog.showOpenDialogSync(options)
})

ipcMain.on('saveFileDialogSync', (event, args) => {
  const options = { 
    title: "Speicher .csv Datei",
    filters: [{
      name: ".csv Files",
      extensions: ["csv"],
    }],
    defaultPath: args,
  }
  event.returnValue = dialog.showSaveDialogSync(options)
})

ipcMain.on('readFile', (event, args) => {
  const toDoList = []
  fs.createReadStream(args)
  .pipe(csv())
  .on('data', (row) => toDoList.push({
    date: new Date(row.Datum),
    text: row.Text,
  }))
  .on('end', function () {
    event.returnValue = toDoList
  })
  .on('error', () => event.returnValue = false)
})

ipcMain.on('saveFile', (event, args) => {
  const [path, todoList] = args;
  const csvWriter = createCsvWriter({
    path,
    header: [
        {id: 'date', title: 'Datum'},
        {id: 'text', title: 'Text'},
    ]
  });

  const transformedList = todoList.map(el => ({...el, date: el.date.toISOString()}))
  csvWriter.writeRecords(transformedList)
    .then(() => event.returnValue = true)
    .catch((reason) => {
      dialog.showErrorBox('Error saving file', reason.toString())
      event.returnValue = false;
    })
})
