import { Button, ButtonGroup, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Channel } from '../../../common/Channel';
import { Bridge } from '../../../common/Bridge';
import { TimerInput } from './TimerInput';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import PauseIcon from '@material-ui/icons/Pause';

let fullSeconds = 0;
function onTimerInputChange(value: number) {
  fullSeconds = value;
}

export const ControlView = () => {
  const [initial, setInitial] = useState(true);
  const [running, setRunning] = useState(false);
  const [displayVisible, setDisplayVisible] = useState(false);

  useEffect(() => {
    Bridge.on(Channel.ShowDisplay, () => {
      setDisplayVisible(true);
    });
    Bridge.on(Channel.HideDisplay, () => {
      setDisplayVisible(false);
    });
    Bridge.on(Channel.Start, (_, fullSeconds) => {
      setInitial(false);
      setRunning(true);
      setDisplayVisible(true);
    });
  }, []);

  function renderResetButton() {
    return (
      <Button variant='outlined' onClick={() => {
        Bridge.send(Channel.Reset);
        setRunning(false);
        setInitial(true);
      }} >
        <StopIcon />
      </Button>
    );
  };

  const renderStartButton = () => {
    if (running) {
      return (
        <Button variant='contained' onClick={() => {
          setRunning(false);
          Bridge.send(Channel.Pause);
        }}>
          <PauseIcon />
        </Button>
      );
    } else {
      return (
        <Button variant='outlined' onClick={() => {
          setRunning(true);
          if (initial) {
            setInitial(false);
            Bridge.send(Channel.Start, fullSeconds);
          } else {
            Bridge.send(Channel.Resume);
          }
        }}>
          <PlayArrowIcon />
        </Button>
      );
    }
  };

  function renderVisibleButton() {
    if (displayVisible) {
      return (
        <Button variant='contained' onClick={() => {
          Bridge.send(Channel.HideDisplay);
          setDisplayVisible(false);
        }}>
          <VisibilityOffIcon />
        </Button>
      );
    } else {
      return (
        <Button variant='outlined' onClick={() => {
          Bridge.send(Channel.ShowDisplay)
          setDisplayVisible(true);
        }}>
          <VisibilityIcon />
        </Button>
      )
    }
  }

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        <TimerInput onInputChange={onTimerInputChange} />
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
    <ButtonGroup variant="outlined" color="primary">
      {renderStartButton()}
      {renderResetButton()}
      {renderVisibleButton()}
    </ButtonGroup>
      </Grid>
    </div>
  );
}
