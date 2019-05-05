import * as React from 'react';
import { Route, Switch } from 'react-router-dom'
// import Navigator from './components/Navigator';
// import ReportsList from './components/ReportsList';
import {AppState, Screens} from "./model/AppState";

import './css/App.css';
import './css/Global.less';

import Home from './screens/Home';
import Match from './screens/Match';
import Postmatch from './screens/Postmatch';
import Prematch from './screens/Prematch';

export interface IAppProps {
  appState: AppState;
}
export interface IScreenState {
  swipeEnabled: boolean,
}

const appState = new AppState();

const HomeScreen = () => {
  return (
    <Home 
      appState={appState}
    />
  );
}
const PrematchScreen = () => {
  return (
    <Prematch 
      appState={appState}
    />
  );
}
const MatchScreen = () => {
  return (
    <Match 
      appState={appState}
    />
  );
}
const PostmatchScreen = () => {
  return (
    <Postmatch 
      appState={appState}
    />
  );
}

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact={true} path={Screens.Home} component={HomeScreen} />
        <Route exact={true} path={Screens.Prematch} component={PrematchScreen} />
        <Route exact={true} path={Screens.Match} component={MatchScreen} />
        <Route exact={true} path={Screens.Postmatch} component={PostmatchScreen} />
      </Switch>
    );
  }
}

export default App;
