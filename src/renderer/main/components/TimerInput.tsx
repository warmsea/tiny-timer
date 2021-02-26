import React, { useCallback } from "react";
import { NumberInput } from "./NumberInput";

export interface ITimerInputProps {
  onInputChange?: (seconds: number) => void;
}

export function TimerInput(props: ITimerInputProps): JSX.Element {
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  const onInputChange = useCallback(() => {
    const fullSeconds = hours * 60 * 60 + minutes * 60 + seconds;
    props.onInputChange?.(fullSeconds);
  }, []);
  const onHoursChange = useCallback((value) => {
    hours = value;
    onInputChange();
  }, []);
  const onMinutesChange = useCallback((value) => {
    minutes = value;
    onInputChange();
  }, []);
  const onSecondsChange = useCallback((value) => {
    seconds = value;
    onInputChange();
  }, []);

  return (
    <div>
      <NumberInput
        id="hours"
        label="hh"
        max={23}
        onValueChange={onHoursChange}
      />
      <NumberInput
        id="minutes"
        label="mm"
        max={59}
        onValueChange={onMinutesChange}
      />
      <NumberInput
        id="seconds"
        label="ss"
        max={59}
        onValueChange={onSecondsChange}
      />
    </div>
  );
}
