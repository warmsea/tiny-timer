import React from 'react';
import ReactDOM from 'react-dom';

import { MainComponent } from './components/MainComponent';

import './main.scss';

window.onload = () => {
  ReactDOM.render(<MainComponent />, document.getElementById('main'));
};
