const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

if (isDev) {
  console.log('Running in development');
} else {
  console.log('Running in production');
}
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
import dbaccess from '../src/db/dbaccess';
const db = new dbaccess();

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#FFF',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });
  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  createMainIPCs(mainWindow);
};
const createModal = (parent, type) => {
  // Create the browser window.
  const modal = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#FFF',
    modal: true,
    parent: parent,
    frame: false,
    webPreferences: {
      preload: MODAL_PRELOAD_WEBPACK_ENTRY,
    }
  });

  modal.loadURL(MODAL_WEBPACK_ENTRY + `?type=${type}`);
  if (isDev) {
    modal.webContents.openDevTools();
  }
};
const createMainIPCs = function (mainWindow) {
  ipcMain.handle('get-all-rows', (event, table) => {
    const data = db.getAllRows(table);
    return data;
  });
  ipcMain.on('show-modal', function (event, type) {
    createModal(mainWindow, type);
  });
  ipcMain.on('refresh-main', function () {
    mainWindow.webContents.send('refresh');
  });
};

app.on('ready', function () {
  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.closeDBConnection();
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.