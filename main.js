const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');

const DEBUG = process.env.DEBUG;

let controlWindow, displayWindow;

function createWindows() {
  if (!controlWindow) {
    controlWindow = new BrowserWindow({
      width: 400,
      height: 200,
      resizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'controlPreload.js')
      }
    });
    controlWindow.on('closed', () => {
      controlWindow = undefined;
    });
    controlWindow.loadFile('control.html');
  }

  if (!displayWindow) {
    displayWindow = new BrowserWindow({
      width: 100,
      height: 30,
      resizable: DEBUG ? true : false,
      focusable: DEBUG ? true : false,
      alwaysOnTop: true,
      fullscreenable: false,
      show: false,
      frame: false,
      transparent: DEBUG ? false : true,
      webPreferences: {
        preload: path.join(__dirname, 'displayPreload.js')
      }
    });
    displayWindow.on('closed', () => {
      displayWindow = undefined;
    });
    displayWindow.loadFile('display.html');
  }
}

app.whenReady().then(() => {
  createWindows();
  app.on('activate', function () {
    createWindows();
  });

  globalShortcut.register('ctrl+shift+alt+1', () => {
    if (displayWindow) {
      displayWindow.webContents.send('startTimer', 300);
      displayWindow.show();
    }
  });
  globalShortcut.register('ctrl+shift+alt+2', () => {
    if (displayWindow) {
      displayWindow.webContents.send('startTimer', 600);
      displayWindow.show();
    }
  });
  globalShortcut.register('ctrl+shift+alt+3', () => {
    if (displayWindow) {
      displayWindow.webContents.send('startTimer', 900);
      displayWindow.show();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('toggleDisplayWindow', () => {
  if (displayWindow) {
    displayWindow.isVisible() ? displayWindow.hide() : displayWindow.show();
  }
});

ipcMain.on('showDisplayWindow', () => {
  if (displayWindow) {
    displayWindow.show();
  }
});

ipcMain.on('startTimer', (_, seconds) => {
  if (displayWindow) {
    displayWindow.webContents.send('startTimer', seconds);
    displayWindow.show();
  }
});

ipcMain.on('resumeTimer', () => {
  if (displayWindow) {
    displayWindow.webContents.send('resumeTimer');
    displayWindow.show();
  }
});

ipcMain.on('pauseTimer', () => {
  if (displayWindow) {
    displayWindow.webContents.send('pauseTimer');
  }
});

ipcMain.on('resetTimer', () => {
  if (displayWindow) {
    displayWindow.webContents.send('resetTimer');
  }
});
