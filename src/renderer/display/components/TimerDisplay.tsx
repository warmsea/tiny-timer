import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { IBridge } from "../../../common/Bridge";
import { Channel } from "../../../common/Channel";

export function getDisplayNumber(seconds: number): number {
  if (Math.abs(seconds) >= 3600) {
    return Math.ceil(seconds / 60);
  } else {
    return seconds;
  }
}

export const ColorStyle = {
  Normal: { bgcolor: "white", color: "green" },
  Warn: { bgcolor: "yellow", color: "black" },
  TimeOut: { bgcolor: "red", color: "white" },
};

export function getColorStyle(
  remainingSeconds: number
): { bgcolor: string; color: string } {
  if (remainingSeconds > 30) {
    return ColorStyle.Normal;
  } else if (remainingSeconds > 0) {
    return ColorStyle.Warn;
  } else {
    return ColorStyle.TimeOut;
  }
}

export interface ITimerDisplayProps {
  bridge: IBridge;
}

export const TimerDisplay = (props: ITimerDisplayProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    props.bridge.on(Channel.Tick, (_, seconds) => {
      setRemainingSeconds(seconds);
    });
  }, []);

  let style = getColorStyle(remainingSeconds);
  let displayNumber = getDisplayNumber(remainingSeconds);
  const sign = displayNumber < 0 ? <span className="sign">-</span> : <></>;
  displayNumber = Math.abs(displayNumber);
  const firstPart = (
    <span>
      {Math.floor(displayNumber / 60)
        .toString()
        .padStart(2, "0")}
    </span>
  );
  const secondPart = (
    <span>
      {Math.ceil(displayNumber % 60)
        .toString()
        .padStart(2, "0")}
    </span>
  );
  return (
    <Box bgcolor={style.bgcolor} color={style.color}>
      {sign}
      {firstPart}
      <span className="separator">:</span>
      {secondPart}
    </Box>
  );
};
