import { Box, CssBaseline } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Bridge } from '../common/Bridge';
import { Channel } from '../common/Channel';

import './display.scss';

function getDisplayNumber(seconds: number): number {
  if (Math.abs(seconds) >= 3600) {
    return Math.ceil(seconds / 60);
  } else {
    return seconds;
  }
}

function getStyle(remainingSeconds: number): { bgcolor: string, color: string } {
  if (remainingSeconds > 30) {
    return { bgcolor: "white", color: 'green' };
  } else if (remainingSeconds > 0) {
    return { bgcolor: 'yellow', color: 'black' };
  } else {
    return { bgcolor: 'red', color: 'white' };
  }
}

window.onload = () => {
  ReactDOM.render((
    <>
      <CssBaseline />
      <TimerDisplay />
    </>
  ), document.getElementById('display'));
};

const TimerDisplay = () => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    Bridge.on(Channel.Tick, (_, seconds) => {
      setRemainingSeconds(seconds);
    });
  }, []);

  let style = getStyle(remainingSeconds);
  let displayNumber = getDisplayNumber(remainingSeconds);
  const sign = displayNumber < 0 ? <span className='sign'>-</span> : <></>;
  displayNumber = Math.abs(displayNumber);
  const firstPart = <span>{Math.floor(displayNumber / 60).toString().padStart(2, '0')}</span>;
  const secondPart = <span>{Math.ceil(displayNumber % 60).toString().padStart(2, '0')}</span>;
  return (
    <Box bgcolor={style.bgcolor} color={style.color} >
      {sign}{firstPart}<span className="separator">:</span>{secondPart}
    </Box>
  );
}
