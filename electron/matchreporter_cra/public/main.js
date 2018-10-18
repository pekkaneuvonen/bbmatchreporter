const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = require('electron')

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 320, height: 568});

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/*
ipcMain.on('asynchronous-message', (event, arg) => {
    console.log("asynchronous-message:", arg);
    event.sender.send('asynchronous-reply', 'pong');
});
  
ipcMain.on("synchronous-message", (event, arg) => {
    console.log("synchronous-message:", arg);
    event.returnValue = 'pong';
});
*/
ipcMain.on("LOAD_ASYNC_WITH_PATH", (event, arg) => {
     console.log("LOAD_ASYNC_WITH_PATH:", arg);
     event.sender.send("ASYNC_WITH_PATH_LOADED", 'pong');
});
ipcMain.on("LOAD_FILE_WITH_PATH", (event, arg) => {
    console.log("LOAD_FILE_WITH_PATH:", arg);
    event.returnValue = "FILE_WITH_PATH_LOADED";
});