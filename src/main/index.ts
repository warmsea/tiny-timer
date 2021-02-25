import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import { Ticker } from './Ticker';

import { Channel } from '../common/Channel';

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
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

let displayWindow: BrowserWindow;
const createDisplayWindow = (): void => {
  if (!displayWindow) {
    displayWindow = new BrowserWindow({
      width: 100,
      height: 30,
      resizable: false,
      focusable: false,
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
    displayWindow.on('closed', () => {
      displayWindow = null;
      mainWindow?.webContents.send(Channel.HideDisplay);
    });
  }
};

function showDisplayWindow() {
  createDisplayWindow();
  displayWindow?.show();
}

function hideDisplayWindow() {
  displayWindow?.hide();
}

const ticker = new Ticker();
ticker.setTickAction((remainingSeconds) => {
  displayWindow?.webContents.send(Channel.Tick, remainingSeconds);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createMainWindow();
  createDisplayWindow();
});

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

function startTimer(fullSeconds: number): void {
  showDisplayWindow();
  ticker.start(fullSeconds);
  mainWindow?.webContents.send(Channel.Start, fullSeconds);
}

function pauseTimer(): void {
  ticker.pause();
}

function resumeTimer(): void {
  ticker.resume();
}

function resetTimer(): void {
  ticker.reset();
}

ipcMain.on(Channel.Start, (_, fullSeconds) => {
  startTimer(fullSeconds);
});
ipcMain.on(Channel.Pause, () => pauseTimer());
ipcMain.on(Channel.Resume, () => resumeTimer());
ipcMain.on(Channel.Reset, () => resetTimer());
ipcMain.on(Channel.ShowDisplay, (event: IpcMainEvent) => {
  showDisplayWindow();
  if (mainWindow && event.sender !== mainWindow.webContents) {
    mainWindow?.webContents.send(Channel.ShowDisplay);
  }
});
ipcMain.on(Channel.HideDisplay, (event: IpcMainEvent) => {
  hideDisplayWindow();
  if (mainWindow && event.sender !== mainWindow.webContents) {
    mainWindow?.webContents.send(Channel.HideDisplay);
  }
});
