import { CssBaseline } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";

import { Bridge } from "../../common/Bridge";
import { TimerDisplay } from "./components/TimerDisplay";

import "./display.scss";

window.onload = () => {
  ReactDOM.render(
    <>
      <CssBaseline />
      <TimerDisplay bridge={Bridge} />
    </>,
    document.getElementById("display")
  );
};
