const path = require('path');

const { app, BrowserWindow, Menu, Tray } = require('electron');
const isDev = require('electron-is-dev');

let tray = null




function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 450,
    height: 500,
    fullscreen: true,
    icon: "extraResources/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

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