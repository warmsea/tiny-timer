const { ipcRenderer } = require('electron');

window.toggleDisplayWindow = () => {
  ipcRenderer.send('toggleDisplayWindow');
}

window.showDisplayWindow = () => {
  ipcRenderer.send('showDisplayWindow');
}

window.startTimer = (seconds) => {
  ipcRenderer.send('startTimer', seconds);
}

window.resumeTimer = () => {
  ipcRenderer.send('resumeTimer');
}

window.pauseTimer = () => {
  ipcRenderer.send('pauseTimer');
}

window.resetTimer = () => {
  ipcRenderer.send('resetTimer');
}
