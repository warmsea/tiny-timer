import { Box, Container, Grid } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { Channel } from '../../common/Channel';
import { Bridge } from '../../common/Bridge';
import { Ticker } from '../ticker/Ticker';
import { TimerControl } from './TimerControl';
import { TimerInput } from './TimerInput';

let fullSeconds = 0;
function onTimerInputChange(value: number) {
  fullSeconds = value;
  console.log(fullSeconds);
}

const ticker = new Ticker();
ticker.setTickAction((seconds: number) => {
  Bridge.send(Channel.Tick, seconds);
});

function onStart() {
  ticker.start(fullSeconds);
}

function onPause() {
  ticker.pause();
}

function onResume() {
  ticker.resume();
}

function onReset() {
  ticker.reset();
}

function onShowDisplay() {
  Bridge.send(Channel.ShowDisplay);
}

function onHideDisplay() {
  Bridge.send(Channel.HideDisplay);
}

export const ControlView = () => {
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <TimerInput onInputChange={onTimerInputChange} />
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <TimerControl
          onStart={onStart}
          onPause={onPause}
          onResume={onResume}
          onReset={onReset}
          onShowDisplay={onShowDisplay}
          onHideDisplay={onHideDisplay}
        />
      </Grid>
    </div>
  );
}
