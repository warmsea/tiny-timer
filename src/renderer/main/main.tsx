import { CssBaseline } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";

import { MainComponent } from "./components/MainComponent";

import "./main.scss";

window.onload = () => {
  ReactDOM.render(
    <>
      <CssBaseline />
      <MainComponent />
    </>,
    document.getElementById("main")
  );
};
