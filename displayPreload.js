const { ipcRenderer } = require('electron');

let targetTime, remainingMilliseconds;
let timerInterval = 0;
let state = 'stop';

window.onload = () => {
  reset();
}

ipcRenderer.on('startTimer', (_, seconds) => {
  if (Number.isSafeInteger(seconds) && 0 <= seconds <= 86400) {
    remainingMilliseconds = seconds * 1000;
  }
  start();
});

ipcRenderer.on('resumeTimer', () => {
  resume();
});

ipcRenderer.on('pauseTimer', () => {
  pause();
});

ipcRenderer.on('resetTimer', () => {
  reset();
});

window.setInterval(() => {
  console.log(state)
}, 1000);

function updateDisplay() {
  let remainingSeconds = Math.ceil((targetTime - Date.now()) / 1000);
  const negtive = remainingSeconds < 0;
  absRemainingSeconds = Math.abs(remainingSeconds);

  const minutes = Math.floor(absRemainingSeconds / 60);
  const seconds = absRemainingSeconds % 60;

  const displays = getDisplays();
  if (remainingSeconds > 30) {
    displays.timer.style.color = 'white';
    displays.timer.style.backgroundColor = 'green';
  } else if (remainingSeconds > 0) {
    displays.timer.style.color = 'black';
    displays.timer.style.backgroundColor = 'yellow';
  } else if (remainingSeconds > -300 || remainingSeconds % 2 === 0) {
    displays.timer.style.color = 'white';
    displays.timer.style.backgroundColor = 'red';
  } else {
    displays.timer.style.color = 'black';
    displays.timer.style.backgroundColor = 'white';
  }
  displays.negative.hidden = !negtive;
  displays.minutes.innerText = minutes.toString().padStart(2, '0');
  displays.seconds.innerText = seconds.toString().padStart(2, '0');
}

function run() {
  targetTime = Date.now() + remainingMilliseconds;
  updateDisplay();
  clearInterval(timerInterval);
  timerInterval = window.setInterval(() => {
    updateDisplay();
  }, 50);
  state = 'run';
}

function start() {
  run();
}

function resume() {
  if (state === 'pause') {
    run();
  }
}

function pause() {
  if (state === 'run') {
    remainingMilliseconds = targetTime - Date.now();
    targetTime = undefined;
    clearInterval(timerInterval);
    state = 'pause';
  }
}

function reset() {
  remainingMilliseconds = 0;
  targetTime = undefined;
  clearInterval(timerInterval);
  state = 'stop';

  const displays = getDisplays();
  displays.timer.style.color = 'black';
  displays.timer.style.backgroundColor = 'white';
  displays.negative.hidden = true;
  displays.minutes.innerText = '00';
  displays.seconds.innerText = '00';
}

function getDisplays() {
  return {
    timer: document.getElementById('timer'),
    negative: document.getElementById('negative'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  }
}
