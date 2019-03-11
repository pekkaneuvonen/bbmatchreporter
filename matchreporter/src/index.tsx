import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';

import { Router } from "react-router-dom";
import history from "./screens/history";

ReactDOM.render(
  <Router history={history}>
    <App/>
  </Router>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
