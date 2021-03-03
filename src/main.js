const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
require('dotenv').config();
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
const rawgApi = require('../src/db/rawg.js');
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
    mainWindow.webContents.openDevTools();

  }
  // Open the DevTools.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.maximize();
  createMainIPCs(mainWindow);
};
const createModal = (parent, type, data) => {
  // Create the browser window.
  const modal = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#FFF',
    modal: true,
    parent: parent,
    frame: (isDev) ? true : false,
    webPreferences: {
      preload: MODAL_PRELOAD_WEBPACK_ENTRY,
    }
  });
  let queryParams = `?type=${type}`;
  if (data) {
    queryParams += `&data=${data}`;
  }

  modal.loadURL(MODAL_WEBPACK_ENTRY + queryParams);
  if (isDev) {
    modal.webContents.openDevTools();
  }
  modal.on('close', function () {
    parent.webContents.send('refresh');
  });

  modal.maximize();
};

const createMainIPCs = function (mainWindow) {
  ipcMain.handle('get-all-rows', (event, table) => {
    const allRows = db.getAllRows(table);
    return allRows;
  });
  ipcMain.handle('get-GameById', (event, itemid) => {
    const item = db.getRowItem('games', itemid);
    return item;
  });
  ipcMain.handle('add-rows', (event, data) => {
    db.addRowItems(data.form, data.keys, data.rows, function (resp) {
      if (resp.length) {
        event.sender.send('notification', 'fail', 'There were some problems!' + resp);
      } else {
        event.sender.send('notification', 'success', 'Item(s) successfully added!');
      }
    });
  });
  ipcMain.handle('update-item', (event, data) => {
    db.updateRowItem(data.form, data.rows[0], data.rowID, function (resp) {
      if (resp.length) {
        event.sender.send('notification', 'fail', 'There were some problems!' + resp);
      } else {
        event.sender.send('notification', 'success', 'Item(s) successfully updated!');
      }
    });
  });
  ipcMain.on('show-modal', function (event, type, data) {
    createModal(mainWindow, type, data);
  });

  ipcMain.handle('api-search', async function (event, game) {
    const results = await rawgApi.searchGames(game);
    return results;
  });
  ipcMain.handle('getLookups', function (event) {
    const data = {
      genres: db.getAllRows('genres'),
      platforms: db.getAllRows('platforms'),
      statuses: db.getAllRows('statuses')
    };
    return data;
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