import * as React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import StoragePage from './containers/StoragePage';

export default () => (
  <App>
    <Switch>
      <Route path="/storage" component={StoragePage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
