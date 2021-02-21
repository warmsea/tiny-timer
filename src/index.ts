import { BrowserWindow, app, ipcMain } from 'electron';

import { Channel } from './common/Channel';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const DISPLAY_WINDOW_WEBPACK_ENTRY: string;
declare const DISPLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow: BrowserWindow;
const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

let displayWindow: BrowserWindow;
const showDisplayWindow = (): void => {
  if (!displayWindow) {
    displayWindow = new BrowserWindow({
      width: 100,
      height: 30,
      // resizable: DEBUG ? true : false,
      // focusable: DEBUG ? true : false,
      alwaysOnTop: true,
      fullscreenable: false,
      show: false,
      frame: false,
      transparent: true,
      webPreferences: {
        contextIsolation: true,
        preload: DISPLAY_WINDOW_PRELOAD_WEBPACK_ENTRY
      }
    });
    displayWindow.loadURL(DISPLAY_WINDOW_WEBPACK_ENTRY);
  }
  displayWindow.on('closed', () => {
    displayWindow = null;
    mainWindow?.webContents.send(Channel.HideDisplay);
  });
  displayWindow?.show();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on(Channel.ShowDisplay, () => {
  showDisplayWindow();
});

ipcMain.on(Channel.HideDisplay, () => {
  displayWindow?.hide();
});

ipcMain.on(Channel.Tick, (_, seconds) => {
  displayWindow?.webContents.send(Channel.Tick, seconds);
});
