import React, { useState } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import PauseIcon from '@material-ui/icons/Pause';

export interface ITimerControlProps {
  onShowDisplay?: () => void;
  onHideDisplay?: () => void;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onReset?: () => void;
}

export const TimerControl = (props: ITimerControlProps) => {
  const [initial, setInitial] = useState(true);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);

  const renderStartButton = () => {
    if (running) {
      return (
        <Button variant='contained' onClick={() => {
          props.onPause?.();
          setRunning(false);
        }}>
          <PauseIcon />
        </Button>
      );
    } else {
      return (
        <Button variant='outlined' onClick={() => {
          if (initial) {
            setInitial(false);
            props.onStart?.();
          } else {
            props.onResume?.();
          }
          setRunning(true);
        }}>
          <PlayArrowIcon />
        </Button>
      );
    }
  };

  const renderResetButton = () => {
    return (
      <Button variant='outlined' onClick={() => {
        props.onReset?.();
        setRunning(false);
        setInitial(true);
      }} >
        <StopIcon />
      </Button>
    );
  };

  const renderVisibleButton = () => {
    if (visible) {
      return (
        <Button variant='contained' onClick={() => {
          props.onHideDisplay?.();
          setVisible(false);
        }}>
          <VisibilityOffIcon />
        </Button>
      );
    } else {
      return (
        <Button variant='outlined' onClick={() => {
          props.onShowDisplay?.();
          setVisible(true);
        }}>
          <VisibilityIcon />
        </Button>
      )
    }
  };

  return (
    <ButtonGroup variant="outlined" color="primary">
      {renderStartButton()}
      {renderResetButton()}
      {renderVisibleButton()}
    </ButtonGroup>
  )
}
